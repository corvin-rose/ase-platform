import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Like } from '../../rest/model/Like';
import { Shader } from '../../rest/model/shader';
import { User } from '../../rest/model/user';
import { Auth } from '../../rest/service/auth.service';
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

  constructor(
    private route: ActivatedRoute,
    private shaderService: ShaderService,
    private userService: UserService,
    private errorService: ErrorService,
    private likeService: LikeService
  ) {}

  ngOnInit(): void {
    this.shaderId = this.route.snapshot.params['id'];
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
          if (Auth.user?.id === shader.authorId) {
            // TODO: edit is not showing after refresh
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
      },
      error: (error) => this.handleError(error),
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
    if (Auth.user?.id !== undefined) {
      return this.likes.includes(Auth.user?.id);
    } else {
      return false;
    }
  }

  likeClick(): void {
    if (Auth.user?.id !== undefined) {
      const like: Like = {
        shaderId: this.shaderId,
        userId: Auth.user?.id,
      };
      this.likeService.addLike(like).subscribe({
        next: () => {
          if (Auth.user?.id !== undefined) {
            this.likes.push(Auth.user?.id);
          }
        },
        error: (error) => this.handleError(error),
      });
    }
  }

  unlikeClick(): void {
    if (Auth.user?.id !== undefined) {
      const like: Like = {
        shaderId: this.shaderId,
        userId: Auth.user?.id,
      };
      this.likeService.deleteLike(like).subscribe({
        next: () => {
          if (Auth.user?.id !== undefined) {
            this.likes.splice(this.likes.indexOf(Auth.user?.id), 1);
          }
        },
        error: (error) => this.handleError(error),
      });
    }
  }
}
