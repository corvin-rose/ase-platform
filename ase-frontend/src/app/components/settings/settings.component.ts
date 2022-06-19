import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { User } from "../../rest/model/user";
import { Auth, AuthService } from "../../rest/service/auth.service";
import { ErrorService } from "../../rest/service/error.service";
import { UserService } from "../../rest/service/user.service";

@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.css"],
})
export class SettingsComponent implements OnInit {
  firstName: string = "";
  lastName: string = "";
  email: string = "";

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private errorService: ErrorService
  ) {}

  ngOnInit(): void {
    this.authService.getUserAfterAuth()?.then((user) => {
      this.firstName = user?.firstName ? user.firstName : "";
      this.lastName = user?.lastName ? user.lastName : "";
      this.email = user?.email ? user.email : "";
    });
  }

  valuesChanged(): boolean {
    return (
      Auth.user?.firstName !== this.firstName ||
      Auth.user.lastName !== this.lastName
    );
  }

  onSubmit(form: NgForm): void {
    if (!form.valid) return;

    const user: User = {
      id: Auth.user?.id,
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      email: this.email,
      password: Auth.user?.password,
    };

    this.userService.updateUser(user).subscribe({
      next: () => {
        this.authService.getUserAfterAuth()?.then((user) => {
          this.firstName = user?.firstName ? user.firstName : "";
          this.lastName = user?.lastName ? user.lastName : "";
        });
      },
      error: (error: HttpErrorResponse) => {
        this.errorService.showError(error);
        console.error(error.message);
      },
    });
  }
}
