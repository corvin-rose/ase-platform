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
import { SnackbarService } from '../../../service/snackbar.service';
import { ShaderService } from '../../../service/shader.service';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { ShaderBufferDeleteDialogComponent } from '../shader-buffer-delete-dialog/shader-buffer-delete-dialog.component';
import { ShaderSource } from '../../../model/shader-source';
import { forkJoin, map } from 'rxjs';
import { BufferService } from '../../../service/buffer.service';
import { MatLegacyTabGroup } from '@angular/material/legacy-tabs';

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
  @Output() codeChanged = new EventEmitter<ShaderSource>();

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

  shaderSource: ShaderSource = { main: this.code, buffers: new Map() };
  bufferKeys: number[] = [];

  lastChange: number = 0;
  needsUpdate: boolean = false;
  changeInterval: any = null;
  activeTabIndex: number = 0;

  constructor(
    private route: ActivatedRoute,
    private shaderService: ShaderService,
    private errorService: SnackbarService,
    private bufferService: BufferService,
    private elementRef: ElementRef,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.codeChanged.emit(this.shaderSource);
    this.lastChange = new Date().getTime();
    this.changeInterval = setInterval(() => {
      if (this.needsUpdate && new Date().getTime() - this.lastChange > 1000) {
        this.needsUpdate = false;
        if (this.activeTabIndex == 0) {
          this.shaderSource.main = this.code;
        } else {
          this.shaderSource.buffers.set(this.bufferKeys[this.activeTabIndex - 1], this.code);
        }
        this.codeChanged.emit(this.shaderSource);
      }
    }, 1000);

    if (this.readOnly) {
      this.editorOptions.readOnly = this.readOnly;
    }

    let path: string = '/' + this.route.snapshot.url.join('/');
    if (path !== '/shader/new') {
      let shaderId: string = this.route.snapshot.params['id'];
      forkJoin([
        this.shaderService.getShaderById(shaderId),
        this.bufferService.getAllBuffersWithShaderId(shaderId),
      ])
        .pipe(
          map(([shader, loadedBuffers]) => {
            if (shader.shaderCode !== undefined) {
              this.code = shader.shaderCode;
              const buffersMap = new Map();
              loadedBuffers.forEach((buffer) => {
                buffersMap.set(parseInt(buffer.bufferKey), buffer.bufferCode);
              });
              this.shaderSource = { main: shader.shaderCode, buffers: buffersMap };
              this.updateBufferKeys();
            }
          })
        )
        .subscribe({
          next: () => {},
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
    this.activeTabIndex = event.index;
    if (event.index == 0) {
      this.code = this.shaderSource.main;
    } else {
      this.code =
        this.shaderSource.buffers.get(this.bufferKeys[event.index - 1]) ?? '// Code not found';
    }
  }

  onAddBuffer(tabGroup: MatLegacyTabGroup): void {
    let bufferIndex = 0;
    let buffer = undefined;

    do {
      bufferIndex++;
      buffer = this.shaderSource.buffers.get(bufferIndex);
    } while (buffer !== undefined);

    this.shaderSource.buffers.set(bufferIndex, `// Buffer ${bufferIndex}\nvoid main() {}`);
    this.updateBufferKeys();
    tabGroup.selectedIndex = bufferIndex;
  }

  onBufferContextmenu(event: MouseEvent, bufferIndex: number): void {
    if (this.readOnly) {
      return;
    }

    event.preventDefault();
    this.menuTopLeftPosition.x = event.clientX;
    this.menuTopLeftPosition.y = event.clientY;
    if (this.matMenuTrigger) {
      this.matMenuTrigger.menuData = { buffer: bufferIndex };
      this.matMenuTrigger.openMenu();
    }
  }

  onBufferDelete(bufferIndex: number): void {
    const dialogRef = this.dialog.open(ShaderBufferDeleteDialogComponent, {
      data: { bufferIndex: bufferIndex, buffers: this.shaderSource.buffers },
      width: '600px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.shaderSource.buffers?.delete(result.bufferIndex);
        this.updateBufferKeys();
      }
    });
  }

  updateBufferKeys(): void {
    this.bufferKeys = [...this.shaderSource.buffers.keys()];
  }
}
