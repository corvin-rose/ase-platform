import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Shader } from '../../rest/model/shader';
import { User } from '../../rest/model/user';
import { Auth } from '../../rest/service/auth.service';
import { ErrorService } from '../../rest/service/error.service';
import { ShaderService } from '../../rest/service/shader.service';
import { UserService } from '../../rest/service/user.service';

@Component({
  selector: 'app-shader-viewer',
  templateUrl: './shader-viewer.component.html',
  styleUrls: ['./shader-viewer.component.css']
})
export class ShaderViewerComponent implements OnInit {

  shaderCode: string = 'void main() {}';
  shaderTitle: string = 'Title'; 
  author: string = 'Author';
  like: boolean = false;
  likeCount: number = 0;
  canEdit: boolean = false;

  constructor(private route: ActivatedRoute,
              private shaderService: ShaderService,
              private userService: UserService,
              private errorService: ErrorService) { }

  ngOnInit(): void {
    let shaderId: string = this.route.snapshot.params['id'];
    this.shaderService.getShaderById(shaderId).subscribe({
      next: (shader: Shader) => {
        this.shaderCode = shader.shaderCode;
        this.shaderTitle = shader.title;
        this.userService.getUserById(shader.authorId).subscribe({
          next: (user: User) => {
            this.author = user.firstName + ' ' + user.lastName;
          },
          error: (error: HttpErrorResponse) => {
            this.errorService.showError(error);
            console.error(error.message);
          }
        });
        if (Auth.user?.id === shader.authorId) {
          this.canEdit = true;
        }
      },
      error: (error: HttpErrorResponse) => {
        this.errorService.showError(error);
        console.error(error.message);
      }
    })
  }

}
