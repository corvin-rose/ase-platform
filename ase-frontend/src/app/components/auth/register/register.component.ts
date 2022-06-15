import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../rest/service/user.service';
import { User } from '../../../rest/model/user';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  constructor(private router: Router, private userService: UserService) { }

  onSubmit(form: NgForm): void {
    if (!form.valid) return;

    const user: User = {
      id: '',
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      email: form.value.email,
      password: form.value.password
    }

    this.userService.addUser(user).subscribe({
      next: () => {
        // TODO: redirect to user profile
        this.router.navigate(['/']);
      },
      error: (error: HttpErrorResponse) => {
        console.error(error.message);
      }
    });
  }
}
