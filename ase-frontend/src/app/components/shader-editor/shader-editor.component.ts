import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';

@Component({
  selector: 'app-shader-editor',
  templateUrl: './shader-editor.component.html',
  styleUrls: ['./shader-editor.component.css']
})
export class ShaderEditorComponent implements OnInit {

  @ViewChild('shaderPreviewContainer', {static: true}) shaderPreviewContainer!: ElementRef;

  shader: string = 'void main() { gl_FragColor = vec4(0.0); }';
  messages: {content: string, error: boolean}[] = [];
  consoleContainerHeight: number = 0;

  ngOnInit(): void {
    this.calcConsoleContainerHeight();
  }

  onCodeChanged(code: string): void {
    this.shader = code;
  }

  @HostListener('window:resize', ['$event'])
  onResize(_event: any) {
    this.calcConsoleContainerHeight();
  }

  calcConsoleContainerHeight(): void {
    let canvasHeight: number = 9/16 * this.shaderPreviewContainer.nativeElement.offsetWidth;
    this.consoleContainerHeight = this.shaderPreviewContainer.nativeElement.offsetHeight - (canvasHeight + 20);
  }

  onMessage(messages: {content: string, error: boolean}[]): void {
    this.messages = messages;
  }
}
