import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
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
    private errorService: ErrorService
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

  private getUserAfterAuth(): void {
    if (Auth.token !== null) {
      const authToken: Token = {
        token: Auth.token,
      };
      this.userService.authUser(authToken).subscribe({
        next: (response: User) => {
          Auth.user = response;
        },
        error: (error: HttpErrorResponse) => {
          this.errorService.showError(error);
          console.error(error.message);
        },
      });
    }
  }
}

export class Auth {
  public static token: string | null = null;
  public static user: User | null = null;
}
