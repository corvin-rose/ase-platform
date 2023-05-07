import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Like } from '../../model/like';
import { Shader } from '../../model/shader';
import { User } from '../../model/user';
import { AuthService } from '../../service/auth.service';
import { SnackbarService } from '../../service/snackbar.service';
import { LikeService } from '../../service/like.service';
import { ShaderService } from '../../service/shader.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  likes: number = 0;
  user: User | null = null;

  constructor(
    private likeService: LikeService,
    private shaderService: ShaderService,
    private errorService: SnackbarService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.getUserAfterAuth().then((user) => {
      this.user = user;
      this.shaderService.getShaders().subscribe({
        next: (shaders: Shader[]) => {
          let userShaders = shaders.filter((v) => v.authorId === this.user?.id).map((v) => v.id);
          this.likeService.getAllLikes().subscribe({
            next: (response: Like[]) => {
              this.likes = response.filter((v) => userShaders.includes(v.shaderId)).length;
            },
            error: (error: HttpErrorResponse) => {
              this.errorService.showError(error);
              console.error(error.message);
            },
          });
        },
        error: (error: HttpErrorResponse) => {
          this.errorService.showError(error);
          console.error(error.message);
        },
      });
    });
  }

  getFilter(shader: Shader): boolean {
    const user = this.user?.id ? this.user?.id : '-1';
    return shader.authorId === user;
  }

  getUsername(): string {
    return this.user?.firstName + ' ' + this.user?.lastName;
  }

  getLikes(): number {
    return this.likes;
  }

  getProfileIconLetters(): string {
    if (this.user !== null) {
      let user: User = this.user;
      let fChar: string | undefined = user.firstName?.charAt(0);
      let lChar: string | undefined = user.lastName?.charAt(0);
      if (fChar !== undefined && lChar !== undefined) {
        return fChar + lChar;
      }
    }
    return 'U';
  }
}
