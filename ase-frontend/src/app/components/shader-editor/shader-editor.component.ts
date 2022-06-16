import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ShaderService } from '../../rest/service/shader.service';
import { Shader } from '../../rest/model/shader';
import { ShaderCreateDialogComponent } from './shader-create-dialog/shader-create-dialog.component';
import { HttpErrorResponse } from '@angular/common/http';
import { Auth } from '../../rest/service/auth.service';

@Component({
  selector: 'app-shader-editor',
  templateUrl: './shader-editor.component.html',
  styleUrls: ['./shader-editor.component.css']
})
export class ShaderEditorComponent implements OnInit {

  @ViewChild('shaderPreviewContainer', {static: true}) shaderPreviewContainer!: ElementRef;
  @ViewChild('buttonContainer', {static: true}) buttonContainer!: ElementRef;

  shader: string = 'void main() { gl_FragColor = vec4(0.0); }';
  messages: {content: string, error: boolean}[] = [];
  shaderImg: string = '';
  consoleContainerHeight: number = 0;

  constructor(private dialog: MatDialog, 
              private shaderService: ShaderService) {}

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
    this.consoleContainerHeight = this.shaderPreviewContainer.nativeElement.offsetHeight - (canvasHeight + this.buttonContainer.nativeElement.offsetHeight + 20*2);
  }

  onMessage(messages: {content: string, error: boolean}[]): void {
    this.messages = messages;
  }

  onCompile(data: {compileImg: string}): void {
    this.shaderImg = data.compileImg;
  }

  onCreateClick(): void {
    const dialogRef = this.dialog.open(ShaderCreateDialogComponent, {
      width: '250px',
      data: '',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined && Auth.user !== null) {
        const shader: Shader = {
          id: '',
          shaderCode: this.shader,
          title: result,
          authorId: Auth.user.id,
          previewImg: this.shaderImg
        }
        this.shaderService.addShader(shader).subscribe({
          next: (response: Shader) => {
            // TODO: redirect to edit or view page
          },
          error: (error: HttpErrorResponse) => {
            console.error(error.message);
          }
        });
      }
    });
  }
}
