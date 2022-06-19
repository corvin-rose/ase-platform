import { Component, Input, OnInit } from "@angular/core";
import { ShaderService } from "../../rest/service/shader.service";
import { Shader } from "../../rest/model/shader";
import { User } from "../../rest/model/user";
import { HttpErrorResponse } from "@angular/common/http";
import { UserService } from "../../rest/service/user.service";
import { ErrorService } from "../../rest/service/error.service";
import { LikeService } from "../../rest/service/like.service";
import { Like } from "../../rest/model/Like";
import { Auth } from "../../rest/service/auth.service";

@Component({
  selector: "app-shader-list",
  templateUrl: "./shader-list.component.html",
  styleUrls: ["./shader-list.component.css"],
})
export class ShaderListComponent implements OnInit {
  shaders: Shader[] = [];
  authors: Map<string, string> = new Map();
  likes: Map<string, number> = new Map();
  currentUserLikes: Map<string, boolean> = new Map();

  @Input() filter: string = "";

  constructor(
    private shaderService: ShaderService,
    private userService: UserService,
    private errorService: ErrorService,
    private likeService: LikeService
  ) {}

  ngOnInit(): void {
    this.getShaders();
  }

  getShaders(): void {
    this.shaderService.getShaders().subscribe({
      next: (response: Shader[]) => {
        this.shaders = response.filter((v) => this.matchesFilter(v));
        this.getUsers(
          this.shaders.map((v) => (v.authorId ? v.authorId : "-1"))
        );
        this.getLikes();
      },
      error: (error: HttpErrorResponse) => {
        this.errorService.showError(error);
        console.error(error.message);
      },
    });
  }

  getUsers(ids: string[]): void {
    this.userService.getUsers().subscribe({
      next: (response: User[]) => {
        response
          .filter((v) => v.id !== undefined && ids.includes(v.id))
          .forEach((user) => {
            if (user.id !== undefined) {
              this.authors.set(user.id, user.firstName + " " + user.lastName);
            }
          });
      },
      error: (error: HttpErrorResponse) => {
        this.errorService.showError(error);
        console.error(error.message);
      },
    });
  }

  getLikes(): void {
    this.likeService.getAllLikes().subscribe({
      next: (response: Like[]) => {
        this.likes = response
          .filter((v) => v.userId !== Auth.user?.id)
          .map((v) => v.shaderId)
          .reduce((map, cur) => {
            let val = map.get(cur);
            if (val !== undefined) {
              map.set(cur, ++val);
            } else {
              map.set(cur, 1);
            }
            return map;
          }, new Map<string, number>());
        this.currentUserLikes = response
          .filter((v) => v.userId === Auth.user?.id)
          .reduce((map, cur) => {
            return map.set(cur.shaderId, true);
          }, new Map<string, boolean>());
      },
      error: (error: HttpErrorResponse) => {
        this.errorService.showError(error);
        console.error(error.message);
      },
    });
  }

  getId(shader: Shader): string {
    return shader.id ? shader.id : "00000000-0000-0000-0000-000000000000";
  }

  getTitle(shader: Shader): string {
    return shader.title ? shader.title : "Shader Title";
  }

  getUsername(shader: Shader): string {
    const author: string | undefined = this.authors.get(
      shader.authorId ? shader.authorId : ""
    );
    if (author !== undefined) {
      return author;
    }
    return "User";
  }

  getPreviewImg(shader: Shader): string {
    return shader.previewImg
      ? shader.previewImg
      : "data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=";
  }

  getLikeCount(shaderId: string | undefined): number {
    if (shaderId === undefined) return 0;
    let count = this.likes.get(shaderId);
    return count ? count : 0;
  }

  getUserHasLikedShader(shaderId: string | undefined): boolean {
    return (
      shaderId !== undefined &&
      this.currentUserLikes.get(shaderId) !== undefined
    );
  }

  matchesFilter(shader: Shader): boolean {
    if (this.filter === "") {
      return true;
    }
    return shader.authorId === this.filter;
  }
}
