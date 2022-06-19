import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Token } from "../model/token";
import { User } from "../model/user";
import { ErrorService } from "./error.service";
import { UserService } from "./user.service";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  SESSION_FIELD = "session_id";

  constructor(
    private userService: UserService,
    private errorService: ErrorService,
    private router: Router
  ) {
    Auth.token = localStorage.getItem(this.SESSION_FIELD);
    this.getUserAfterAuth();
  }

  registerSuccessfulLogin(token: string): void {
    localStorage.setItem(this.SESSION_FIELD, token);
    Auth.token = token;
    this.getUserAfterAuth();
  }

  logout(): void {
    localStorage.removeItem(this.SESSION_FIELD);
    Auth.token = null;
    Auth.user = null;
  }

  isUserLoggedIn(): boolean {
    let token = localStorage.getItem(this.SESSION_FIELD);
    return token !== null;
  }

  getUserAfterAuth(): Promise<User | null> | null {
    if (Auth.token !== null) {
      const authToken: Token = {
        token: Auth.token,
      };
      return new Promise((resolve, reject) => {
        this.userService.authUser(authToken).subscribe({
          next: (response: User) => {
            Auth.user = response;
            resolve(response);
          },
          error: (error: HttpErrorResponse) => {
            this.errorService.showError(error);
            console.error(error.message);
            resolve(null);
            this.logout();
            this.router.navigate(["/login"]);
          },
        });
      });
    } else {
      return null;
    }
  }
}

export class Auth {
  public static token: string | null = null;
  public static user: User | null = null;
}
