export interface ShaderSource {
  main: string;
  buffers: Map<number, string | null>;
}
