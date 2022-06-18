import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../rest/service/user.service';
import { User } from '../../../rest/model/user';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from '../../../rest/service/error.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  constructor(private router: Router, 
              private userService: UserService,
              private errorService: ErrorService) { }

  onSubmit(form: NgForm): void {
    if (!form.valid) return;

    const user: User = {
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      email: form.value.email,
      password: form.value.password
    }

    this.userService.registerUser(user).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error: HttpErrorResponse) => {
        this.errorService.showError(error);
        console.error(error.message);
      }
    });
  }
}
