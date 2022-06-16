import { Component, OnInit } from '@angular/core';
import { ShaderService } from '../../rest/service/shader.service';
import { Shader } from '../../rest/model/shader';
import { User } from '../../rest/model/user';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../../rest/service/user.service';
import { ErrorService } from '../../rest/service/error.service';

@Component({
  selector: 'app-shader-list',
  templateUrl: './shader-list.component.html',
  styleUrls: ['./shader-list.component.css']
})
export class ShaderListComponent implements OnInit {

  shaders: Shader[] = [];
  authors: Map<string, string> = new Map();

  constructor(private shaderService: ShaderService, 
              private userService: UserService,
              private errorService: ErrorService) { }

  ngOnInit(): void {
    this.getShaders();
  }

  getShaders(): void {
    this.shaderService.getShaders().subscribe({
      next: (response: Shader[]) => {
        this.shaders = response;
        this.getUsers(response.map(v => v.authorId));
      },
      error: (error: HttpErrorResponse) => {
        this.errorService.showError(error);
        console.error(error.message);
      }
    })
  }

  getUsers(ids: string[]): void {
    this.userService.getUsers().subscribe({
      next: (response: User[]) => {
        response.filter(v => ids.includes(v.id)).forEach(user => {
          this.authors.set(user.id, user.firstName + ' ' + user.lastName);
        });
      },
      error: (error: HttpErrorResponse) => {
        this.errorService.showError(error);
        console.error(error.message);
      }
    });
  }


}
