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
} from '@angular/core';
import { ShaderSource } from '../../../model/shader-source';

@Component({
  selector: 'app-shader-renderer',
  templateUrl: './shader-renderer.component.html',
  styleUrls: ['./shader-renderer.component.css'],
})
export class ShaderRendererComponent implements OnInit, OnChanges {
  @ViewChild('shaderRenderer', { static: true }) shaderRenderer!: ElementRef;

  @Output() onMessage = new EventEmitter<{ content: string; error: boolean }[]>();
  @Output() onCompile = new EventEmitter<{ compileImg: string }>();
  @Input() shader: ShaderSource;
  @Input() renderId: string = '';

  time: number = 0;
  frame: number = 0;
  program: any = null;
  bufferPrograms: {
    program: WebGLProgram | null;
    texture: WebGLTexture | null;
    buffer: WebGLFramebuffer | null;
    bufferKey: number;
  }[] = [];
  size: { x: number; y: number } = { x: 0, y: 0 };
  mousePos: { x: number; y: number } = { x: 0, y: 0 };
  vertexBuffer: WebGLBuffer | null = 0;
  indexBuffer: WebGLBuffer | null = 0;
  compilerId: number = 0;
  shaderLineOffset: number = 0;

  constructor() {
    this.shader = {
      main: '',
      buffers: new Map(),
    };
  }

  ngOnChanges(_changes: SimpleChanges): void {
    this.compileShaders();
  }

  ngOnInit(): void {
    this.compileShaders();
  }

  compileShaders(): void {
    this.time = 0;
    this.frame = 0;
    this.mousePos = { x: 0, y: 0 };
    this.compilerId += 1;
    let currentCompiler: number = this.compilerId;

    const canvas = this.shaderRenderer.nativeElement;
    canvas.width = 640;
    canvas.height = 320;
    this.size = { x: canvas.width, y: canvas.height };

    canvas.addEventListener('mousedown', (event: MouseEvent) => {
      this.mousePos.x = event.offsetX / canvas.clientWidth;
      this.mousePos.y = event.offsetY / canvas.clientHeight;
    });

    const options = { preserveDrawingBuffer: true };

    let createGl = null;
    if (createGl === null) createGl = canvas.getContext('webgl2', options);
    if (createGl === null) createGl = canvas.getContext('experimental-webgl2', options);
    if (createGl === null) createGl = canvas.getContext('webgl', options);
    if (createGl === null) createGl = canvas.getContext('experimental-webgl', options);

    if (createGl === null) {
      this.sendErrors(['Error compiling shader', 'WebGL is not supported on your device']);
      console.error('WebGL could not be loaded');
      return;
    }

    const gl: WebGL2RenderingContext | WebGLRenderingContext = createGl;
    const newGlVersion: boolean = !(gl instanceof WebGLRenderingContext);

    // Basic shader code setup
    const shaderVersion = newGlVersion ? '#version 300 es' : '';
    const vertexPositions = newGlVersion
      ? 'layout(location = 0) in vec2 position;'
      : 'attribute vec2 position;';
    const vShaderSrc = `${shaderVersion}
                        #ifdef GL_ES
                        precision highp float;
                        precision highp int;
                        #endif
                        ${vertexPositions}
                        void main()	{
                            gl_Position = vec4(position, 0.0, 1.0);
                        }`;

    const colorDef = newGlVersion ? 'out vec4 fragColor;\n#define gl_FragColor fragColor' : '';
    const textureFunctions = newGlVersion
      ? ''
      : `
                          vec4 texture(sampler2D   s, vec2 c)          { return texture2D(s,c); }
                          vec4 texture(sampler2D   s, vec2 c, float b) { return texture2D(s,c,b); }
                          vec4 texture(samplerCube s, vec3 c )         { return textureCube(s,c); }
                          vec4 texture(samplerCube s, vec3 c, float b) { return textureCube(s,c,b); }
    `;
    const fShaderSetup = `${shaderVersion}
                          #ifdef GL_ES
                          precision highp float;
                          precision highp int;
                          #endif
                          ${textureFunctions}

                          uniform vec2 RESOLUTION;
                          uniform float TIME;
                          uniform int FRAME;
                          uniform vec2 MOUSE;

                          uniform sampler2D buffer1;
                          uniform sampler2D buffer2;
                          uniform sampler2D buffer3;
                          uniform sampler2D buffer4;
                          ${colorDef}`;
    const fShaderSrc = `${fShaderSetup}
                        ${this.shader.main}`;

    this.shaderLineOffset = fShaderSetup.split('\n').length;

    // Create vertex buffer
    const vertexBufferData: Float32Array = new Float32Array([
      -1.0, 1.0, 0.0, -1.0, -1.0, 0.0, 1.0, -1.0, 0.0, 1.0, 1.0, 0.0,
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

    // Delete old buffer programs
    for (const bufferProgram of this.bufferPrograms) {
      gl.deleteFramebuffer(bufferProgram.buffer);
      gl.deleteTexture(bufferProgram.texture);
      gl.deleteProgram(bufferProgram.program);
    }
    this.bufferPrograms = [];

    // Create new buffer programs
    const filteredBuffers = new Map([...this.shader.buffers].filter(([k, v]) => v !== null));
    for (let key of filteredBuffers.keys()) {
      const bufferShaderSrc = `${fShaderSetup}
                               ${this.shader.main.replace(/void\s+main\s*\([^)]*\)/, 'void _()')}
                               ${filteredBuffers.get(key)}`;

      const fragShader = this.createShader(gl, bufferShaderSrc, gl.FRAGMENT_SHADER);
      const vertShader = this.createShader(gl, vShaderSrc, gl.VERTEX_SHADER);
      if (fragShader === null || vertShader === null) {
        console.error('Error while creating shaders', fragShader, vertShader);
        return;
      }

      const bufferProgram: any = this.createProgram(gl, vertShader, fragShader);

      const bufferTexture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, bufferTexture);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        this.size.x,
        this.size.y,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        null
      );
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      const buffer = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, buffer);
      gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0,
        gl.TEXTURE_2D,
        bufferTexture,
        0
      );

      this.bufferPrograms.push({
        program: bufferProgram,
        texture: bufferTexture,
        buffer: buffer,
        bufferKey: key,
      });
    }

    // Create main program
    const fragShader = this.createShader(gl, fShaderSrc, gl.FRAGMENT_SHADER);
    const vertShader = this.createShader(gl, vShaderSrc, gl.VERTEX_SHADER);
    if (fragShader === null || vertShader === null) {
      console.error('Error while creating shaders', fragShader, vertShader);
      return;
    }

    this.program = this.createProgram(gl, fragShader, vertShader);
    gl.useProgram(this.program);
    gl.clearColor(0, 0, 0, 1);
    gl.viewport(0, 0, this.size.x, this.size.y);

    this.bufferPrograms.forEach((bufferProgram) => {
      const bufferLocation = gl.getUniformLocation(
        this.program,
        `buffer${bufferProgram.bufferKey}`
      );
      switch (bufferProgram.bufferKey) {
        case 1:
          gl.uniform1i(bufferLocation, 1);
          gl.activeTexture(gl.TEXTURE1);
          break;
        case 2:
          gl.uniform1i(bufferLocation, 2);
          gl.activeTexture(gl.TEXTURE2);
          break;
        case 3:
          gl.uniform1i(bufferLocation, 3);
          gl.activeTexture(gl.TEXTURE3);
          break;
        case 4:
          gl.uniform1i(bufferLocation, 4);
          gl.activeTexture(gl.TEXTURE4);
          break;
      }
      gl.bindTexture(gl.TEXTURE_2D, bufferProgram.texture);
    });

    this.sendMessages(['shader compiled!']);

    this.render(gl);

    let pixelValues = new Uint8ClampedArray(4 * this.size.x * this.size.y);
    gl.readPixels(0, 0, this.size.x, this.size.y, gl.RGBA, gl.UNSIGNED_BYTE, pixelValues);
    let preview = document.createElement('canvas');
    preview.width = this.size.x;
    preview.height = this.size.y;
    let imageData = new ImageData(pixelValues, this.size.x, this.size.y);
    preview.getContext('2d')?.putImageData(this.flipImageData(imageData), 0, 0);

    this.onCompile.emit({
      compileImg: preview.toDataURL('image/jpeg'),
    });

    let currentTime: any = new Date();
    let lastTime: any = currentTime;
    let loop = () => {
      currentTime = new Date();
      let deltaTime: number = (currentTime - lastTime) / 1000;
      this.time += deltaTime;
      this.frame += 1;

      this.render(gl);
      if (currentCompiler === this.compilerId) requestAnimationFrame(loop);

      lastTime = currentTime;
    };
    requestAnimationFrame(loop);
  }

  render(gl: WebGL2RenderingContext | WebGLRenderingContext): void {
    gl.clear(gl.COLOR_BUFFER_BIT);

    for (const program of [...this.bufferPrograms.map((v) => v.program), this.program]) {
      gl.useProgram(program);
      const resolutionLoc: WebGLUniformLocation | null = gl.getUniformLocation(
        program,
        'RESOLUTION'
      );
      gl.uniform2f(resolutionLoc, this.size.x, this.size.y);
      const timeLoc: WebGLUniformLocation | null = gl.getUniformLocation(program, 'TIME');
      gl.uniform1f(timeLoc, this.time);
      const frameLoc: WebGLUniformLocation | null = gl.getUniformLocation(program, 'FRAME');
      gl.uniform1i(frameLoc, this.frame);
      const mouseLoc: WebGLUniformLocation | null = gl.getUniformLocation(program, 'MOUSE');
      gl.uniform2f(mouseLoc, this.mousePos.x, this.mousePos.y);
    }

    this.bufferPrograms.forEach((bufferProgram) => {
      gl.bindFramebuffer(gl.FRAMEBUFFER, bufferProgram.buffer);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
      gl.viewport(0, 0, this.size.x, this.size.y);
      gl.useProgram(bufferProgram.program);
      gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    });

    gl.useProgram(this.program);
    const positionAttrib: number = gl.getAttribLocation(this.program, 'position');
    gl.enableVertexAttribArray(positionAttrib);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.vertexAttribPointer(positionAttrib, 3, gl.FLOAT, false, 0, 0);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
  }

  createShader(
    gl: WebGL2RenderingContext | WebGLRenderingContext,
    src: string,
    type: number
  ): WebGLShader | null {
    let shader: WebGLShader | null = gl.createShader(type);
    if (shader === null) {
      console.error('Error creating shader from gl instance.');
      return null;
    }

    gl.shaderSource(shader, src);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      let error = gl.getShaderInfoLog(shader);
      this.sendErrors([
        'Error compiling shader',
        (error ? error : '').replace(
          /(ERROR: [0-9]+:)([0-9]+)/g,
          (_: any, g1: string, g2: string) => {
            return g1 + (parseInt(g2) - this.shaderLineOffset);
          }
        ),
      ]);
      console.error(error);
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  createProgram(
    gl: WebGL2RenderingContext | WebGLRenderingContext,
    vShader: WebGLShader,
    fShader: WebGLShader
  ) {
    let prog: WebGLProgram | null = gl.createProgram();
    if (prog === null) {
      console.error('Error creating shader program from gl instance.');
      return;
    }
    gl.attachShader(prog, vShader);
    gl.attachShader(prog, fShader);
    gl.linkProgram(prog);

    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error('Error creating shader program.', gl.getProgramInfoLog(prog));
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
          flipped.data[((imageData.height - row) * flipped.width + col) * 4 + i] = sourcePixel[i];
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
