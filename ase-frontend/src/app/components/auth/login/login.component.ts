import { HttpErrorResponse } from "@angular/common/http";
import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { Token } from "../../../rest/model/token";
import { User } from "../../../rest/model/user";
import { AuthService } from "../../../rest/service/auth.service";
import { ErrorService } from "../../../rest/service/error.service";
import { UserService } from "../../../rest/service/user.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent {
  constructor(
    private router: Router,
    private userService: UserService,
    private authService: AuthService,
    private errorService: ErrorService
  ) {}

  onSubmit(form: NgForm): void {
    if (!form.valid) return;

    const user: User = {
      email: form.value.email,
      password: form.value.password,
    };

    this.userService.loginUser(user).subscribe({
      next: (response: Token) => {
        this.authService.registerSuccessfulLogin(response.token);
        // TODO: redirect to user profile
        this.router.navigate(["/"]);
      },
      error: (error: HttpErrorResponse) => {
        this.errorService.showError(error);
        console.error("Login error", error.message);
      },
    });
  }
}
