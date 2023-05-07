import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { Shader } from '../model/shader';
import { AuthService } from '../service/auth.service';
import { SnackbarService } from '../service/snackbar.service';
import { ShaderService } from '../service/shader.service';

@Injectable()
export class ShaderGuard implements CanActivate {
  constructor(
    private router: Router,
    private shaderService: ShaderService,
    private errorService: SnackbarService,
    private authService: AuthService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    if (route.params['id'] === null) {
      this.router.navigate(['/']);
      return false;
    }

    return this.canEdit(route).then((canEdit) => {
      if (canEdit) {
        return true;
      } else {
        let params = route.url.map((v) => v.path);
        params.splice(params.indexOf('edit'), 1);
        this.router.navigate(['/', ...params]);
        this.errorService.showCustomError('You do not have permission to edit this shader');
        return false;
      }
    });
  }

  canEdit(route: ActivatedRouteSnapshot): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const shaderId: string = route.params['id'];
      this.authService.getUserAfterAuth().then((user) => {
        this.shaderService.getShaderById(shaderId).subscribe({
          next: (response: Shader) => {
            if (response.authorId === user?.id) {
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
    });
  }
}
