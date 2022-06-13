import { Component, OnInit, ElementRef, ViewChild, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-shader-renderer',
  templateUrl: './shader-renderer.component.html',
  styleUrls: ['./shader-renderer.component.css']
})
export class ShaderRendererComponent implements OnInit, OnChanges {

  @ViewChild('shaderRenderer', {static: true}) shaderRenderer!: ElementRef;

  @Output() onMessage = new EventEmitter<{content: string, error: boolean}[]>();
  @Input() shader: string;

  time: number = 0;
  program: any = null;
  size: {x: number, y: number} = {x: 0, y: 0};
  vertexBuffer: number = 0;
  compilerId: number = 0;

  constructor() {
    this.shader = '';
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.compileShaders();
  }

  ngOnInit(): void {
    this.compileShaders();
  }

  compileShaders(): void {
    this.time = 0;
    this.compilerId += 1;
    let currentCompiler: number = this.compilerId;

    const canvas = this.shaderRenderer.nativeElement;
    this.size = {x: canvas.height, y: canvas.width};
    const gl = canvas.getContext("webgl2");

    const vShaderSrc = `#version 300 es
                        precision highp float;
                        in vec2 position;
                        void main()	{
                            gl_Position = vec4(position, 0.0, 0.0);
                        }`;

    const fShaderSrc = `#version 300 es
                        precision highp float;
                        uniform vec2 RESOLUTION;
                        uniform float TIME;
                        out vec4 fragColor;
                        #define gl_FragColor fragColor
                        ${this.shader}`;

    const vertexBufferData: Float32Array = new Float32Array([
        -1,  3,  0,
         3, -1,  0,
        -1, -1,  0
    ]);
    this.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexBufferData, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    this.program = this.createProgram(gl,
      this.createShader(gl, fShaderSrc, gl.FRAGMENT_SHADER),
      this.createShader(gl, vShaderSrc, gl.VERTEX_SHADER),
    );
    gl.useProgram(this.program);
    gl.clearColor(0, 0, 0, 1);
    gl.viewport(0, 0, canvas.width, canvas.height);

    this.sendMessages(['compiled!']);

    let currentTime: any = new Date();
    let lastTime: any = currentTime;
    let loop = () => {
        currentTime = new Date();
        let deltaTime: number = (currentTime - lastTime) / 1000;
        this.time += deltaTime;

        this.render(gl);
        if (currentCompiler === this.compilerId) requestAnimationFrame(loop);

        lastTime = currentTime;
    };
    requestAnimationFrame(loop);
  }

  render(gl: any): void {
    gl.clear(gl.COLOR_BUFFER_BIT);

    const positionAttrib: number = gl.getAttribLocation(this.program, "position");
    gl.enableVertexAttribArray(positionAttrib);

    const resolutionLoc: number = gl.getUniformLocation(this.program, "RESOLUTION");
    gl.uniform2f(resolutionLoc, this.size.x, this.size.y);
    const timeLoc: number = gl.getUniformLocation(this.program, "TIME");
    gl.uniform1f(timeLoc, this.time);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.vertexAttribPointer(positionAttrib, 3, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  createShader(gl: any, src: string, type: any) {
    let shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      this.sendErrors([
        'Error compiling shader',
        gl.getShaderInfoLog(shader)
       ]);
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  createProgram(gl: any, vShader: any, fShader: any) {
    let prog = gl.createProgram();
    gl.attachShader(prog, vShader);
    gl.attachShader(prog, fShader);
    gl.linkProgram(prog);

    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error("Error creating shader program.", gl.getProgramInfoLog(prog));
      gl.deleteProgram(prog);
      return null;
    }

    gl.detachShader(prog, vShader);
    gl.detachShader(prog, fShader);
    gl.deleteShader(fShader);
    gl.deleteShader(vShader);

    return prog;
  }

  sendMessages(message: string[]): void {
    this.onMessage.emit(message.map(v => {
      return {content: v, error: false}
    }));
  }

  sendErrors(message: string[]): void {
    this.onMessage.emit(message.map(v => {
      return {content: v, error: true}
    }));
  }
}
