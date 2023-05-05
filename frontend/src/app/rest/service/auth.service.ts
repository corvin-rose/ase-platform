import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Token } from '../model/token';
import { User } from '../model/user';
import { ErrorService } from './error.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  static SESSION_FIELD = 'session_id';

  constructor(
    private userService: UserService,
    private errorService: ErrorService,
    private router: Router
  ) {
    Auth.token = localStorage.getItem(AuthService.SESSION_FIELD);
    this.getUserAfterAuth();
  }

  registerSuccessfulLogin(token: string): void {
    localStorage.setItem(AuthService.SESSION_FIELD, token);
    Auth.token = token;
    this.getUserAfterAuth();
  }

  logout(): void {
    localStorage.removeItem(AuthService.SESSION_FIELD);
    Auth.token = null;
  }

  isUserLoggedIn(): boolean {
    let token = localStorage.getItem(AuthService.SESSION_FIELD);
    return token !== null;
  }

  getUserAfterAuth(): Promise<User | null> {
    if (Auth.token !== null) {
      const authToken: Token = {
        token: Auth.token,
      };
      return new Promise((resolve, reject) => {
        this.userService.authUser(authToken).subscribe({
          next: (response: User) => {
            resolve(response);
          },
          error: (error: HttpErrorResponse) => {
            this.errorService.showError(error);
            console.error(error.message);
            resolve(null);
          },
        });
      });
    } else {
      return new Promise((resolve, _) => resolve(null));
    }
  }
}

export class Auth {
  public static token: string | null = null;
}
