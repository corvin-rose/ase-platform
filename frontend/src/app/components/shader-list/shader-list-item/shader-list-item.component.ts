import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Like } from '../../../model/like';
import { AuthService } from '../../../service/auth.service';
import { SnackbarService } from '../../../service/snackbar.service';
import { LikeService } from '../../../service/like.service';
import { User } from '../../../model/user';

@Component({
  selector: 'app-shader-list-item',
  templateUrl: './shader-list-item.component.html',
  styleUrls: ['./shader-list-item.component.css'],
})
export class ShaderListItemComponent implements OnInit {
  @Input() title: string = 'Shader';
  @Input() userName: string = 'User';
  @Input() authorId: string = '';
  @Input() id: string = '';
  @Input() previewImg: string = '';
  @Input() likes: number = 0;
  @Input() userHasLiked: boolean = false;

  user: User | null = null;

  constructor(
    private likeService: LikeService,
    private errorService: SnackbarService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.getUserAfterAuth().then((user) => (this.user = user));
  }

  likeClick(): void {
    if (this.user?.id !== undefined) {
      const like: Like = {
        shaderId: this.id,
        userId: this.user?.id,
      };
      this.likeService.addLike(like).subscribe({
        next: () => {
          this.userHasLiked = true;
        },
        error: (error: HttpErrorResponse) => {
          this.errorService.showError(error);
          console.error(error.message);
        },
      });
    }
  }

  unlikeClick(): void {
    if (this.user?.id !== undefined) {
      const like: Like = {
        shaderId: this.id,
        userId: this.user?.id,
      };
      this.likeService.deleteLike(like).subscribe({
        next: () => {
          this.userHasLiked = false;
        },
        error: (error: HttpErrorResponse) => {
          this.errorService.showError(error);
          console.error(error.message);
        },
      });
    }
  }

  getLikeCount(): number {
    return this.likes + (this.userHasLiked ? 1 : 0);
  }
}
