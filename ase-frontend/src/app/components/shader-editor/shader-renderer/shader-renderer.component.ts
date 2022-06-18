import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
} from "@angular/core";

@Component({
  selector: "app-shader-renderer",
  templateUrl: "./shader-renderer.component.html",
  styleUrls: ["./shader-renderer.component.css"],
})
export class ShaderRendererComponent implements OnInit, OnChanges {
  @ViewChild("shaderRenderer", { static: true }) shaderRenderer!: ElementRef;

  @Output() onMessage = new EventEmitter<
    { content: string; error: boolean }[]
  >();
  @Output() onCompile = new EventEmitter<{ compileImg: string }>();
  @Input() shader: string;

  time: number = 0;
  program: any = null;
  size: { x: number; y: number } = { x: 0, y: 0 };
  vertexBuffer: number = 0;
  indexBuffer: number = 0;
  compilerId: number = 0;
  shaderLineOffset: number = 6;

  constructor() {
    this.shader = "";
  }

  ngOnChanges(_changes: SimpleChanges): void {
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
    canvas.width = 640;
    canvas.height = 320;
    this.size = { x: canvas.width, y: canvas.height };
    const gl = canvas.getContext("webgl2", { preserveDrawingBuffer: true });

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
      -0.5,
      0.5,
      0.0,
      -0.5,
      -0.5,
      0.0,
      0.5,
      -0.5,
      0.0,
      0.5,
      0.5,
      0.0,
    ]);
    const indexData: Uint16Array = new Uint16Array([3, 2, 1, 3, 1, 0]);

    this.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexBufferData, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    this.indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexData, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    this.program = this.createProgram(
      gl,
      this.createShader(gl, fShaderSrc, gl.FRAGMENT_SHADER),
      this.createShader(gl, vShaderSrc, gl.VERTEX_SHADER)
    );
    gl.useProgram(this.program);
    gl.clearColor(0, 0, 0, 1);
    gl.viewport(0, 0, this.size.x, this.size.y);

    this.sendMessages(["shader compiled!"]);

    this.render(gl);

    let pixelValues = new Uint8ClampedArray(4 * this.size.x * this.size.y);
    gl.readPixels(
      0,
      0,
      this.size.x,
      this.size.y,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      pixelValues
    );
    let preview = document.createElement("canvas");
    preview.width = this.size.x;
    preview.height = this.size.y;
    let imageData = new ImageData(pixelValues, this.size.x, this.size.y);
    preview.getContext("2d")?.putImageData(this.flipImageData(imageData), 0, 0);

    this.onCompile.emit({
      compileImg: preview.toDataURL("image/jpeg"),
    });

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

    const positionAttrib: number = gl.getAttribLocation(
      this.program,
      "position"
    );
    gl.enableVertexAttribArray(positionAttrib);

    const resolutionLoc: number = gl.getUniformLocation(
      this.program,
      "RESOLUTION"
    );
    gl.uniform2f(resolutionLoc, this.size.x, this.size.y);
    const timeLoc: number = gl.getUniformLocation(this.program, "TIME");
    gl.uniform1f(timeLoc, this.time);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.vertexAttribPointer(positionAttrib, 3, gl.FLOAT, false, 0, 0);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
  }

  createShader(gl: any, src: string, type: any) {
    let shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      this.sendErrors([
        "Error compiling shader",
        gl
          .getShaderInfoLog(shader)
          .replace(
            /(ERROR: [0-9]+:)([0-9]+)/g,
            (_: any, g1: string, g2: string) => {
              return g1 + (parseInt(g2) - this.shaderLineOffset);
            }
          ),
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
      console.error(
        "Error creating shader program.",
        gl.getProgramInfoLog(prog)
      );
      gl.deleteProgram(prog);
      return null;
    }

    gl.detachShader(prog, vShader);
    gl.detachShader(prog, fShader);
    gl.deleteShader(fShader);
    gl.deleteShader(vShader);

    return prog;
  }

  flipImageData(imageData: ImageData): ImageData {
    let flipped = new ImageData(imageData.width, imageData.height);
    for (let row = 0; row < imageData.height; row++) {
      for (let col = 0; col < imageData.width; col++) {
        let sourcePixel = imageData.data.subarray(
          (row * imageData.width + col) * 4,
          (row * imageData.width + col) * 4 + 4
        );
        for (let i = 0; i < 4; i++) {
          flipped.data[
            ((imageData.height - row) * flipped.width + col) * 4 + i
          ] = sourcePixel[i];
        }
      }
    }
    return flipped;
  }

  sendMessages(message: string[]): void {
    this.onMessage.emit(
      message.map((v) => {
        return { content: v, error: false };
      })
    );
  }

  sendErrors(message: string[]): void {
    this.onMessage.emit(
      message.map((v) => {
        return { content: v, error: true };
      })
    );
  }
}
