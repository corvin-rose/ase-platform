import { Component, OnInit } from "@angular/core";
import { ShaderService } from "../../rest/service/shader.service";
import { Shader } from "../../rest/model/shader";
import { User } from "../../rest/model/user";
import { HttpErrorResponse } from "@angular/common/http";
import { UserService } from "../../rest/service/user.service";
import { ErrorService } from "../../rest/service/error.service";

@Component({
  selector: "app-shader-list",
  templateUrl: "./shader-list.component.html",
  styleUrls: ["./shader-list.component.css"],
})
export class ShaderListComponent implements OnInit {
  shaders: Shader[] = [];
  authors: Map<string, string> = new Map();

  constructor(
    private shaderService: ShaderService,
    private userService: UserService,
    private errorService: ErrorService
  ) {}

  ngOnInit(): void {
    this.getShaders();
  }

  getShaders(): void {
    this.shaderService.getShaders().subscribe({
      next: (response: Shader[]) => {
        this.shaders = response;
        this.getUsers(response.map((v) => (v.authorId ? v.authorId : "-1")));
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
}
