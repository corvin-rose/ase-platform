import { Component, OnInit, Input, ViewChild, ElementRef, Renderer2, OnChanges } from '@angular/core';

@Component({
  selector: 'app-shader-console',
  templateUrl: './shader-console.component.html',
  styleUrls: ['./shader-console.component.css']
})
export class ShaderConsoleComponent implements OnInit, OnChanges {

  @ViewChild('messageContainer', {static: true}) messageContainer!: ElementRef;
  @ViewChild('consoleTitle', {static: true}) consoleTitle!: ElementRef;
  @Input() containerHeight: number;
  @Input() messages: {content: string, error: boolean}[];

  constructor(private renderer: Renderer2) {
    this.messages = [];
    this.containerHeight = 0;
  }

  ngOnInit(): void {
    this.setMessageContainerHeight();
  }

  ngOnChanges(): void {
    this.setMessageContainerHeight();
  }

  setMessageContainerHeight(): void {
    this.renderer.setStyle(
      this.messageContainer.nativeElement,
      'height',
      (this.containerHeight - this.consoleTitle.nativeElement.offsetHeight) + 'px'
     );
  }

  reformatString(input: string): string {
    return input.replace('\n', '<br>');
  }
}
