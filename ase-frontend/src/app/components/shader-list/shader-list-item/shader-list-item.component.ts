import { HttpErrorResponse } from "@angular/common/http";
import { Component, Input } from "@angular/core";
import { Like } from "../../../rest/model/Like";
import { Auth } from "../../../rest/service/auth.service";
import { ErrorService } from "../../../rest/service/error.service";
import { LikeService } from "../../../rest/service/like.service";

@Component({
  selector: "app-shader-list-item",
  templateUrl: "./shader-list-item.component.html",
  styleUrls: ["./shader-list-item.component.css"],
})
export class ShaderListItemComponent {
  @Input() title: string = "Shader";
  @Input() user: string = "User";
  @Input() id: string = "";
  @Input() previewImg: string = "";
  @Input() likes: number = 0;
  @Input() userHasLiked: boolean = false;

  constructor(
    private likeService: LikeService,
    private errorService: ErrorService
  ) {}

  likeClick(): void {
    if (Auth.user?.id !== undefined) {
      const like: Like = {
        shaderId: this.id,
        userId: Auth.user?.id,
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
    if (Auth.user?.id !== undefined) {
      const like: Like = {
        shaderId: this.id,
        userId: Auth.user?.id,
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
