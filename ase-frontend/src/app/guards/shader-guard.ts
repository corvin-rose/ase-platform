import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";
import { Observable } from "rxjs";
import { Shader } from "../rest/model/shader";
import { Auth } from "../rest/service/auth.service";
import { ErrorService } from "../rest/service/error.service";
import { ShaderService } from "../rest/service/shader.service";

@Injectable()
export class ShaderGuard implements CanActivate {
  constructor(
    private router: Router,
    private shaderService: ShaderService,
    private errorService: ErrorService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    if (route.params["id"] === null) {
      this.router.navigate(["/"]);
      return false;
    }

    return this.canEdit(route).then((canEdit) => {
      if (canEdit) {
        return true;
      } else {
        let params = route.url.map((v) => v.path);
        params.splice(params.indexOf("edit"), 1);
        this.router.navigate(["/", ...params]);
        this.errorService.showCustomError(
          "You do not have permission to edit this shader"
        );
        return false;
      }
    });
  }

  canEdit(route: ActivatedRouteSnapshot): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const shaderId: string = route.params["id"];
      this.shaderService.getShaderById(shaderId).subscribe({
        next: (response: Shader) => {
          if (response.authorId === Auth.user?.id) {
            resolve(true);
          } else {
            resolve(false);
          }
        },
        error: (error: HttpErrorResponse) => {
          this.errorService.showError(error);
          console.error(error.message);
          resolve(false);
        },
      });
    });
  }
}
