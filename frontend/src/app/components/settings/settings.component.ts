import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { User } from '../../model/user';
import { AuthService } from '../../service/auth.service';
import { SnackbarService } from '../../service/snackbar.service';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit {
  firstName: string = '';
  lastName: string = '';
  email: string = '';

  user: User | null = null;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private errorService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.authService.getUserAfterAuth().then((user) => {
      this.user = user;
      this.firstName = user?.firstName ? user.firstName : '';
      this.lastName = user?.lastName ? user.lastName : '';
      this.email = user?.email ? user.email : '';
    });
  }

  valuesChanged(): boolean {
    return this.user?.firstName !== this.firstName || this.user.lastName !== this.lastName;
  }

  onSubmit(form: NgForm): void {
    if (!form.valid) return;

    const user: User = {
      id: this.user?.id,
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      email: this.email,
      password: this.user?.password,
    };

    this.userService.patchUser(user).subscribe({
      next: () => {
        this.authService.getUserAfterAuth().then((user) => {
          this.firstName = user?.firstName ? user.firstName : '';
          this.lastName = user?.lastName ? user.lastName : '';
        });
      },
      error: (error: HttpErrorResponse) => {
        this.errorService.showError(error);
        console.error(error.message);
      },
    });
  }
}
