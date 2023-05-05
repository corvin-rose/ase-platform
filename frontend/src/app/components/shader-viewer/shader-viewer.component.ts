import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Like } from '../../rest/model/Like';
import { Shader } from '../../rest/model/shader';
import { User } from '../../rest/model/user';
import { Auth, AuthService } from '../../rest/service/auth.service';
import { ErrorService } from '../../rest/service/error.service';
import { LikeService } from '../../rest/service/like.service';
import { ShaderService } from '../../rest/service/shader.service';
import { UserService } from '../../rest/service/user.service';

@Component({
  selector: 'app-shader-viewer',
  templateUrl: './shader-viewer.component.html',
  styleUrls: ['./shader-viewer.component.css'],
})
export class ShaderViewerComponent implements OnInit {
  shaderCode: string = 'void main() {}';
  shaderTitle: string = 'Title';
  shaderId: string = '00000000-0000-0000-0000-000000000000';
  author: string = 'Author';
  likes: string[] = [];
  canEdit: boolean = false;
  loadedData: boolean = false;

  user: User | null = null;

  constructor(
    private route: ActivatedRoute,
    private shaderService: ShaderService,
    private userService: UserService,
    private errorService: ErrorService,
    private likeService: LikeService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.shaderId = this.route.snapshot.params['id'];
    this.authService.getUserAfterAuth().then((user) => {
      this.user = user;
      this.shaderService.getShaderById(this.shaderId).subscribe({
        next: (shader: Shader) => {
          if (
            shader.authorId !== undefined &&
            shader.shaderCode !== undefined &&
            shader.title !== undefined
          ) {
            this.shaderCode = shader.shaderCode;
            this.shaderTitle = shader.title;
            this.userService.getUserById(shader.authorId).subscribe({
              next: (user: User) => {
                this.author = user.firstName + ' ' + user.lastName;
              },
              error: (error) => this.handleError(error),
            });
            if (this.user?.id === shader.authorId) {
              this.canEdit = true;
            }
          }
          if (shader.id !== undefined) {
            this.likeService.getAllLikesByShaderId(shader.id).subscribe({
              next: (response: string[]) => {
                this.likes = response;
              },
              error: (error) => this.handleError(error),
            });
          }
          this.loadedData = true;
        },
        error: (error) => {
          this.handleError(error);
          this.loadedData = true;
        },
      });
    });
  }

  handleError(error: HttpErrorResponse): void {
    this.errorService.showError(error);
    console.error(error.message);
  }

  getLikeCount(): number {
    return this.likes.length;
  }

  activeUserHasLiked(): boolean {
    if (this.user?.id !== undefined) {
      return this.likes.includes(this.user?.id);
    } else {
      return false;
    }
  }

  likeClick(): void {
    if (this.user?.id !== undefined) {
      const like: Like = {
        shaderId: this.shaderId,
        userId: this.user?.id,
      };
      this.likeService.addLike(like).subscribe({
        next: () => {
          if (this.user?.id !== undefined) {
            this.likes.push(this.user?.id);
          }
        },
        error: (error) => this.handleError(error),
      });
    }
  }

  unlikeClick(): void {
    if (this.user?.id !== undefined) {
      const like: Like = {
        shaderId: this.shaderId,
        userId: this.user?.id,
      };
      this.likeService.deleteLike(like).subscribe({
        next: () => {
          if (this.user?.id !== undefined) {
            this.likes.splice(this.likes.indexOf(this.user?.id), 1);
          }
        },
        error: (error) => this.handleError(error),
      });
    }
  }
}
