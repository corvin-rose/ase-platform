import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { Like } from "../../rest/model/Like";
import { Shader } from "../../rest/model/shader";
import { User } from "../../rest/model/user";
import { Auth, AuthService } from "../../rest/service/auth.service";
import { ErrorService } from "../../rest/service/error.service";
import { LikeService } from "../../rest/service/like.service";
import { ShaderService } from "../../rest/service/shader.service";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.css"],
})
export class ProfileComponent implements OnInit {
  likes: number = 0;

  constructor(
    private likeService: LikeService,
    private shaderService: ShaderService,
    private errorService: ErrorService
  ) {}

  ngOnInit(): void {
    this.shaderService.getShaders().subscribe({
      next: (shaders: Shader[]) => {
        let userShaders = shaders
          .filter((v) => v.authorId === Auth.user?.id)
          .map((v) => v.id);
        this.likeService.getAllLikes().subscribe({
          next: (response: Like[]) => {
            this.likes = response.filter((v) =>
              userShaders.includes(v.shaderId)
            ).length;
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
  }

  getFilter(shader: Shader): boolean {
    const user = Auth.user?.id ? Auth.user?.id : "-1";
    return shader.authorId === user;
  }

  getUsername(): string {
    return Auth.user?.firstName + " " + Auth.user?.lastName;
  }

  getLikes(): number {
    return this.likes;
  }

  getProfileIconLetters(): string {
    if (Auth.user !== null) {
      let user: User = Auth.user;
      let fChar: string | undefined = user.firstName?.charAt(0);
      let lChar: string | undefined = user.lastName?.charAt(0);
      if (fChar !== undefined && lChar !== undefined) {
        return fChar + lChar;
      }
    }
    return "U";
  }
}
