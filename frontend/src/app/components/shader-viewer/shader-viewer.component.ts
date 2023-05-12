import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Like } from '../../model/like';
import { Shader } from '../../model/shader';
import { User } from '../../model/user';
import { AuthService } from '../../service/auth.service';
import { SnackbarService } from '../../service/snackbar.service';
import { LikeService } from '../../service/like.service';
import { ShaderService } from '../../service/shader.service';
import { UserService } from '../../service/user.service';
import { ShaderSource } from '../../model/shader-source';
import { concatMap, forkJoin, of } from 'rxjs';
import { BufferService } from '../../service/buffer.service';

@Component({
  selector: 'app-shader-viewer',
  templateUrl: './shader-viewer.component.html',
  styleUrls: ['./shader-viewer.component.css'],
})
export class ShaderViewerComponent implements OnInit {
  shaderCode: ShaderSource = { main: 'void main() {}', buffers: new Map() };
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
    private snackbarService: SnackbarService,
    private likeService: LikeService,
    private authService: AuthService,
    private bufferService: BufferService
  ) {}

  ngOnInit(): void {
    this.shaderId = this.route.snapshot.params['id'];
    this.authService.getUserAfterAuth().then((user) => {
      this.user = user;

      this.shaderService
        .getShaderById(this.shaderId)
        .pipe(
          concatMap((shader: Shader) => {
            const user = shader.authorId ? this.userService.getUserById(shader.authorId) : of(null);
            const likes = this.likeService.getAllLikesByShaderId(this.shaderId);
            const buffer = this.bufferService.getAllBuffersWithShaderId(this.shaderId);
            return forkJoin([of(shader), user, likes, buffer]);
          })
        )
        .subscribe({
          next: ([shader, user, likes, buffer]) => {
            if (
              shader.authorId !== undefined &&
              shader.shaderCode !== undefined &&
              shader.title !== undefined
            ) {
              const buffersMap = new Map();
              buffer.forEach((b) => {
                buffersMap.set(parseInt(b.bufferKey), b.bufferCode);
              });
              this.shaderCode = { main: shader.shaderCode, buffers: buffersMap };
              this.shaderTitle = shader.title;

              this.canEdit = this.user?.id === shader.authorId;
            }
            if (user !== null) {
              this.author = user.firstName + ' ' + user.lastName;
            }
            this.likes = likes;
            this.loadedData = true;
          },
          error: (error) => {
            this.snackbarService.showError(error);
            this.loadedData = true;
          },
        });
    });
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
        error: (error) => this.snackbarService.showError(error),
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
        error: (error) => this.snackbarService.showError(error),
      });
    }
  }
}
