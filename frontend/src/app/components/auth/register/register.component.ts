import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../service/user.service';
import { User } from '../../../model/user';
import { HttpErrorResponse } from '@angular/common/http';
import { SnackbarService } from '../../../service/snackbar.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  constructor(
    private router: Router,
    private userService: UserService,
    private errorService: SnackbarService
  ) {}

  onSubmit(form: NgForm): void {
    if (!form.valid) return;

    const user: User = {
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      email: form.value.email,
      password: form.value.password,
    };

    this.userService.registerUser(user).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error: HttpErrorResponse) => {
        this.errorService.showError(error);
        console.error(error.message);
      },
    });
  }
}
