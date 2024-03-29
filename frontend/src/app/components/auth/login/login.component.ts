import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Token } from '../../../model/token';
import { User } from '../../../model/user';
import { AuthService } from '../../../service/auth.service';
import { SnackbarService } from '../../../service/snackbar.service';
import { UserService } from '../../../service/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  constructor(
    private router: Router,
    private userService: UserService,
    private authService: AuthService,
    private errorService: SnackbarService
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
        this.router.navigate(['/profile']);
      },
      error: (error: HttpErrorResponse) => {
        this.errorService.showError(error);
        console.error('Login error', error.message);
      },
    });
  }
}
