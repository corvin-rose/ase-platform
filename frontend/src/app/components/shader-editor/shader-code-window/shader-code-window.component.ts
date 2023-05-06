import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
  Input,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Shader } from '../../../rest/model/shader';
import { ErrorService } from '../../../rest/service/error.service';
import { ShaderService } from '../../../rest/service/shader.service';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-shader-code-window',
  templateUrl: './shader-code-window.component.html',
  styleUrls: ['./shader-code-window.component.css'],
})
export class ShaderCodeWindowComponent implements OnInit, OnDestroy {
  // Monaco Editor
  // https://github.com/materiahq/ngx-monaco-editor
  // Syntax Highlighting
  // https://github.com/microsoft/monaco-editor/issues/2992
  // Autocomplete
  // https://microsoft.github.io/monaco-editor/playground.html#extending-language-services-custom-languages

  @ViewChild(MatMenuTrigger, { static: true }) matMenuTrigger: MatMenuTrigger | undefined;
  menuTopLeftPosition = { x: 0, y: 0 };

  @Input() readOnly: boolean = false;
  @Input() loading: boolean = false;
  @Output() codeChanged = new EventEmitter<string>();

  editorOptions: any = {
    theme: document.body.classList.contains('dark') ? 'glsl-dark' : 'glsl-light',
    language: 'glsl',
    autoClosingPairs: [{ open: '(', close: ')' }],
  };
  code: string =
    '// Variables you can use:\n' +
    '// TIME       :  float represents the execution time\n' +
    '// RESOLUTION :  vec2 represents the resolution of the screen\n' +
    '// FRAME      :  int represents the current frame\n' +
    '// MOUSE      :  vec2 represents the mouse-click position on the canvas\n' +
    '\n\n' +
    'void main() {\n' +
    '\tvec2 uv = gl_FragCoord.xy / RESOLUTION;\n' +
    '\tvec3 color = vec3(0.0, 0.0, 0.0);\n' +
    '\tgl_FragColor = vec4(color, 1.0);\n' +
    '}\n';

  mainCode: string = this.code;
  bufferCode: string[] = ['// test 1', '// test 2'];

  lastChange: number = 0;
  needsUpdate: boolean = false;
  changeInterval: any = null;

  constructor(
    private route: ActivatedRoute,
    private shaderService: ShaderService,
    private errorService: ErrorService,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.codeChanged.emit(this.code);
    this.lastChange = new Date().getTime();
    this.changeInterval = setInterval(() => {
      if (this.needsUpdate && new Date().getTime() - this.lastChange > 1000) {
        this.needsUpdate = false;
        this.codeChanged.emit(this.code);
      }
    }, 1000);

    if (this.readOnly) {
      this.editorOptions.readOnly = this.readOnly;
    }

    let path: string = '/' + this.route.snapshot.url.join('/');
    if (path !== '/shader/new') {
      let shaderId: string = this.route.snapshot.params['id'];
      this.shaderService.getShaderById(shaderId).subscribe({
        next: (shader: Shader) => {
          if (shader.shaderCode !== undefined) {
            this.code = shader.shaderCode;
            this.mainCode = shader.shaderCode;
          }
        },
        error: (error: HttpErrorResponse) => {
          this.code = '// Shader could not be loaded\n\n' + 'void main() {}';
          this.errorService.showError(error);
          console.error(error.message);
        },
      });
    }
    this.elementRef.nativeElement.style.setProperty('--line-count', this.code.split('\n').length);
  }

  ngModelChanged(_code: string): void {
    this.needsUpdate = true;
    this.lastChange = new Date().getTime();
    this.elementRef.nativeElement.style.setProperty('--line-count', this.code.split('\n').length);
  }

  ngOnDestroy(): void {
    clearInterval(this.changeInterval);
  }

  onTabChanged(event: MatTabChangeEvent): void {
    if (event.index == 0) {
      this.code = this.mainCode;
    } else {
      this.code = this.bufferCode[event.index - 1];
    }
  }

  onAddBuffer(): void {
    this.bufferCode.push('// new buffer');
  }

  onBufferContextmenu(event: MouseEvent, bufferIndex: number): void {
    event.preventDefault();
    this.menuTopLeftPosition.x = event.clientX;
    this.menuTopLeftPosition.y = event.clientY;
    this.matMenuTrigger?.openMenu();
  }
}
