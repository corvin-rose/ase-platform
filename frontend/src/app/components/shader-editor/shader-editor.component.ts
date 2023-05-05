import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  HostListener,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ShaderService } from '../../rest/service/shader.service';
import { Shader } from '../../rest/model/shader';
import { ShaderCreateDialogComponent } from './shader-create-dialog/shader-create-dialog.component';
import { ShaderDeleteDialogComponent } from './shader-delete-dialog/shader-delete-dialog.component';
import { HttpErrorResponse } from '@angular/common/http';
import { Auth, AuthService } from '../../rest/service/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorService } from '../../rest/service/error.service';
import { ShaderSettingsDialogComponent } from './shader-settings-dialog/shader-settings-dialog.component';
import { CanComponentLeave } from '../../guards/leave-page-guard';
import { Observable } from 'rxjs';
import { ShaderLeaveDialogComponent } from './shader-leave-dialog/shader-leave-dialog.component';
import { User } from '../../rest/model/user';

@Component({
  selector: 'app-shader-editor',
  templateUrl: './shader-editor.component.html',
  styleUrls: ['./shader-editor.component.css'],
})
export class ShaderEditorComponent implements OnInit, AfterViewInit, CanComponentLeave {
  @ViewChild('shaderPreviewContainer', { static: true })
  shaderPreviewContainer!: ElementRef;
  @ViewChild('buttonContainer', { static: true }) buttonContainer!: ElementRef;

  shader: string = 'void main() { gl_FragColor = vec4(0.0); }';
  messages: { content: string; error: boolean }[] = [];
  shaderImg: string = '';
  consoleContainerHeight: number = 0;
  editMode: boolean = false;
  oldShaderCode: string = 'void main() { gl_FragColor = vec4(0.0); }';
  loading: boolean = false;
  loadedData: boolean = false;

  user: User | null = null;

  constructor(
    private dialog: MatDialog,
    private shaderService: ShaderService,
    private route: ActivatedRoute,
    private cdref: ChangeDetectorRef,
    private router: Router,
    private errorService: ErrorService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    console.log(this.route.snapshot);
    let path: string = '/' + this.route.snapshot.url.join('/');
    if (path !== '/shader/new') {
      this.editMode = true;

      let shaderId: string = this.route.snapshot.params['id'];
      this.shaderService.getShaderById(shaderId).subscribe({
        next: (shader: Shader) => {
          if (shader.shaderCode !== undefined) {
            this.oldShaderCode = shader.shaderCode;
            this.shader = shader.shaderCode;
            this.loadedData = true;
          }
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

  onCodeChanged(code: string): void {
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
          shaderCode: this.shader,
          title: result,
          authorId: this.user.id,
          previewImg: this.shaderImg,
        };

        this.loading = true;

        setTimeout(() => {
          this.shaderService.addShader(shader).subscribe({
            next: (response: Shader) => {
              this.loading = false;
              this.router.navigate(['/shader', response.id, 'edit']);
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
          response.shaderCode = this.shader;
          response.previewImg = this.shaderImg;
          this.shaderService.updateShader(response).subscribe({
            next: () => {
              this.loading = false;
              this.oldShaderCode = this.shader;
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
    return this.oldShaderCode !== this.shader;
  }

  canLeave(): boolean | Observable<boolean> | Promise<boolean> {
    if (!this.editMode) {
      return true;
    }

    if (this.userMadeChanges()) {
      return new Promise((resolve, reject) => {
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
}
