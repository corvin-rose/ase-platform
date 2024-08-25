import { Size } from './shader-renderer.model';

export class BufferProgram {
  public readonly program: WebGLProgram | null;
  public readonly bufferKey: number;

  private readonly gl: WebGL2RenderingContext | WebGLRenderingContext;
  private readonly buffer1: WebGLFramebuffer;
  private readonly texture1: WebGLTexture;
  private readonly buffer2: WebGLFramebuffer;
  private readonly texture2: WebGLTexture;
  private currentFrame: number = 0;

  constructor(
    gl: WebGL2RenderingContext | WebGLRenderingContext,
    size: Size,
    program: WebGLProgram | null,
    bufferKey: number,
  ) {
    this.gl = gl;
    this.program = program;
    this.bufferKey = bufferKey;

    const colorAttachment = gl.COLOR_ATTACHMENT0;
    const bufferTexture1 = this.createTexture(gl, size);
    const buffer1 = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, buffer1);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, colorAttachment, gl.TEXTURE_2D, bufferTexture1, 0);
    this.texture1 = bufferTexture1 as WebGLTexture;
    this.buffer1 = buffer1 as WebGLBuffer;

    const bufferTexture2 = this.createTexture(gl, size);
    const buffer2 = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, buffer2);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, colorAttachment, gl.TEXTURE_2D, bufferTexture2, 0);
    this.texture2 = bufferTexture2 as WebGLTexture;
    this.buffer2 = buffer2 as WebGLBuffer;
  }

  getTextureForNextFrame(): WebGLTexture {
    if (this.currentFrame % 2 === 0) {
      return this.texture1;
    } else {
      return this.texture2;
    }
  }

  getBufferForNextFrame(): WebGLBuffer {
    if (this.currentFrame++ % 2 === 0) {
      return this.buffer1;
    } else {
      return this.buffer2;
    }
  }

  deleteAllBuffersAndTextures(): void {
    this.gl.deleteFramebuffer(this.buffer1);
    this.gl.deleteTexture(this.texture1);
    this.gl.deleteFramebuffer(this.buffer2);
    this.gl.deleteTexture(this.texture2);
    this.gl.deleteProgram(this.program);
  }

  private createTexture(gl: WebGL2RenderingContext | WebGLRenderingContext, size: Size) {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, size.x, size.y, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    return texture;
  }
}
