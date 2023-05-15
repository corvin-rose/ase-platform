import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ShaderService } from '../../service/shader.service';
import { Shader } from '../../model/shader';
import { ShaderCreateDialogComponent } from './shader-create-dialog/shader-create-dialog.component';
import { ShaderDeleteDialogComponent } from './shader-delete-dialog/shader-delete-dialog.component';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../service/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackbarService } from '../../service/snackbar.service';
import { ShaderSettingsDialogComponent } from './shader-settings-dialog/shader-settings-dialog.component';
import { CanComponentLeave } from '../../guards/leave-page-guard';
import { forkJoin, map, Observable } from 'rxjs';
import { ShaderLeaveDialogComponent } from './shader-leave-dialog/shader-leave-dialog.component';
import { User } from '../../model/user';
import { ShaderSource } from '../../model/shader-source';
import { BufferService } from '../../service/buffer.service';
import { Buffer } from '../../model/buffer';

@Component({
  selector: 'app-shader-editor',
  templateUrl: './shader-editor.component.html',
  styleUrls: ['./shader-editor.component.css'],
})
export class ShaderEditorComponent implements OnInit, AfterViewInit, CanComponentLeave {
  @ViewChild('shaderPreviewContainer', { static: true })
  shaderPreviewContainer!: ElementRef;
  @ViewChild('buttonContainer', { static: true }) buttonContainer!: ElementRef;

  shader: ShaderSource = { main: 'void main() { gl_FragColor = vec4(0.0); }', buffers: new Map() };
  messages: { content: string; error: boolean }[] = [];
  shaderImg: string = '';
  consoleContainerHeight: number = 0;
  editMode: boolean = false;
  oldShaderCode: ShaderSource = this.shader;
  loading: boolean = false;
  loadedData: boolean = false;

  user: User | null = null;

  constructor(
    private dialog: MatDialog,
    private shaderService: ShaderService,
    private route: ActivatedRoute,
    private cdref: ChangeDetectorRef,
    private router: Router,
    private errorService: SnackbarService,
    private authService: AuthService,
    private bufferService: BufferService
  ) {}

  ngOnInit(): void {
    console.log(this.route.snapshot);
    let path: string = '/' + this.route.snapshot.url.join('/');
    if (path !== '/shader/new') {
      this.editMode = true;

      let shaderId: string = this.route.snapshot.params['id'];
      forkJoin([
        this.shaderService.getShaderById(shaderId),
        this.bufferService.getAllBuffersWithShaderId(shaderId),
      ])
        .pipe(
          map(([shader, loadedBuffers]) => {
            if (shader.shaderCode !== undefined) {
              const buffersMap = new Map();
              loadedBuffers.forEach((buffer) => {
                buffersMap.set(parseInt(buffer.bufferKey), buffer.bufferCode);
              });
              this.shader = { main: shader.shaderCode, buffers: buffersMap };
              this.assignOldShaderCode(this.shader);
            }
          })
        )
        .subscribe({
          next: () => {
            this.loadedData = true;
          },
          error: (error: HttpErrorResponse) => {
            this.loadedData = true;
            this.errorService.showError(error);
            console.error(error.message);
          },
        });
    } else {
      this.loadedData = true;
    }
    this.authService.getUserAfterAuth().then((user) => (this.user = user));

    this.onHotkeySave();
  }

  ngAfterViewInit(): void {
    this.calcConsoleContainerHeight();
    this.cdref.detectChanges();
  }

  onCodeChanged(code: ShaderSource): void {
    this.shader = code;
  }

  @HostListener('window:resize', ['$event'])
  onResize(_event: any) {
    this.calcConsoleContainerHeight();
  }

  calcConsoleContainerHeight(): void {
    let canvasHeight: number = (9 / 16) * this.shaderPreviewContainer.nativeElement.offsetWidth;
    this.consoleContainerHeight =
      this.shaderPreviewContainer.nativeElement.offsetHeight -
      (canvasHeight + this.buttonContainer.nativeElement.offsetHeight + 20 * 2);
  }

  onMessage(messages: { content: string; error: boolean }[]): void {
    this.messages = messages;
  }

  onCompile(data: { compileImg: string }): void {
    this.shaderImg = data.compileImg;
  }

  onCreateClick(): void {
    const dialogRef = this.dialog.open(ShaderCreateDialogComponent, {
      width: '350px',
      data: '',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined && this.user !== null) {
        const shader: Shader = {
          shaderCode: this.shader.main,
          title: result,
          authorId: this.user.id,
          previewImg: this.shaderImg,
        };
        this.loading = true;
        setTimeout(() => {
          this.shaderService.addShader(shader).subscribe({
            next: (shaderResponse) => {
              const buffers: Buffer[] = [...this.shader.buffers.entries()].map(
                ([bufferKey, bufferCode]) => {
                  return {
                    bufferKey: bufferKey.toString(),
                    bufferCode: bufferCode,
                    shaderId: shaderResponse.id,
                  };
                }
              );
              this.bufferService.updateBuffers(buffers).subscribe({
                next: () => {
                  this.router.navigate(['/shader', shaderResponse.id, 'edit']);
                  this.loading = false;
                },
                error: (error) => this.disableLoadingAndProcessError(error),
              });
            },
            error: (error) => this.disableLoadingAndProcessError(error),
          });
        }, 500);
      }
    });
  }

  onSaveClick(): void {
    this.loading = true;

    setTimeout(() => {
      let shaderId: string = this.route.snapshot.params['id'];
      this.shaderService.getShaderById(shaderId).subscribe({
        next: (response: Shader) => {
          response.shaderCode = this.shader.main;
          response.previewImg = this.shaderImg;

          const buffers: Buffer[] = [...this.shader.buffers.entries()].map(
            ([bufferKey, bufferCode]) => {
              return {
                bufferKey: bufferKey.toString(),
                bufferCode: bufferCode,
                shaderId: response.id,
              };
            }
          );
          forkJoin([
            this.shaderService.updateShader(response),
            this.bufferService.updateBuffers(buffers),
          ]).subscribe({
            next: () => {
              this.loading = false;
              this.assignOldShaderCode(this.shader);
            },
            error: (error) => this.disableLoadingAndProcessError(error),
          });
        },
        error: (error) => this.disableLoadingAndProcessError(error),
      });
    }, 500);
  }

  onHotkeySave(): void {
    document.onkeydown = (event) => {
      if (event.ctrlKey && event.keyCode == 'S'.charCodeAt(0)) {
        if (this.editMode) {
          if (this.userMadeChanges()) {
            this.onSaveClick();
          }
        } else {
          this.onCreateClick();
        }
        return false;
      }
      return true;
    };
  }

  disableLoadingAndProcessError(error: HttpErrorResponse): void {
    this.loading = false;
    this.errorService.showError(error);
    console.error(error.message);
  }

  onDeleteClick(): void {
    let shaderId: string = this.route.snapshot.params['id'];

    const dialogRef = this.dialog.open(ShaderDeleteDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.shaderService.deleteShader(shaderId).subscribe({
          next: () => {
            this.router.navigate(['/']);
          },
          error: (error: HttpErrorResponse) => {
            this.errorService.showError(error);
            console.error(error.message);
          },
        });
      }
    });
  }

  onSettingsClick(): void {
    let shaderId: string = this.route.snapshot.params['id'];

    this.dialog.open(ShaderSettingsDialogComponent, {
      width: '350px',
      data: shaderId,
    });
  }

  userMadeChanges(): boolean {
    return (
      this.oldShaderCode.main != this.shader.main ||
      [...this.oldShaderCode.buffers.values()].length != [...this.shader.buffers.values()].length ||
      [
        ...Array.of(this.oldShaderCode.buffers.values()).map(
          (v, i) => Array.of(this.shader.buffers.values())[i] != v
        ),
        false,
      ].reduce((a, b) => a || b)
    );
  }

  assignOldShaderCode(newShaderCode: ShaderSource): void {
    const buffersMap = new Map();
    [...newShaderCode.buffers.entries()].forEach(([bufferKey, bufferCode]) => {
      buffersMap.set(bufferKey, bufferCode);
    });
    this.oldShaderCode = {
      main: newShaderCode.main,
      buffers: buffersMap,
    };
  }

  canLeave(): boolean | Observable<boolean> | Promise<boolean> {
    if (!this.editMode) {
      return true;
    }

    if (this.userMadeChanges()) {
      return new Promise((resolve, _) => {
        this.dialog
          .open(ShaderLeaveDialogComponent)
          .afterClosed()
          .subscribe((result) => {
            resolve(result);
          });
      });
    } else {
      return true;
    }
  }

  renderId(): string {
    const shader =
      JSON.stringify(this.shader.main) +
      JSON.stringify(
        ['', ...this.shader.buffers.values()]
          .map((v) => v ?? '')
          .reduce((a: string, b: string) => a + b)
      );
    return Array.from(shader)
      .reduce((s, c) => (Math.imul(31, s) + c.charCodeAt(0)) | 0, 0)
      .toString();
  }
}
