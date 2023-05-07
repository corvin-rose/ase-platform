import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { PasswordResetService } from '../../../service/password-reset.service';
import { SnackbarService } from '../../../service/snackbar.service';
import { ErrorStateMatcher } from '@angular/material/core';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css'],
})
export class PasswordResetComponent implements OnInit {
  token: string | undefined;
  resetPasswordForm: FormGroup;
  passwordErrorMatcher: PasswordErrorStateMatcher = new PasswordErrorStateMatcher();

  constructor(
    private route: ActivatedRoute,
    private passwordResetService: PasswordResetService,
    private snackbarService: SnackbarService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.resetPasswordForm = this.formBuilder.group(
      {
        password: ['', [Validators.required]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.checkPasswords }
    );
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.params['token'];
  }

  checkPasswords: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    let pass = group.get('password')?.value;
    let confirmPass = group.get('confirmPassword')?.value;
    return pass === confirmPass ? null : { notSame: true };
  };

  onResetPassword(form: FormGroup): void {
    if (!form.valid) return;

    this.passwordResetService.resetPassword(this.token ?? '-1', form.value.password).subscribe({
      next: (successful) => {
        if (successful) {
          this.router.navigate(['/login']);
          this.snackbarService.showCustomMessage('Your password was successfully resetted');
        } else {
          this.snackbarService.showCustomError('Something went wrong. Please try again');
        }
      },
      error: (err) => {
        this.snackbarService.showError(err);
      },
    });
  }

  onRequestToken(form: NgForm): void {
    if (!form.valid) return;

    this.passwordResetService.requestPasswordResetFor(form.value.email).subscribe({
      next: (successful) => {
        if (successful) {
          this.router.navigate(['/login']);
          this.snackbarService.showCustomMessage('A password reset email was sent');
        } else {
          this.snackbarService.showCustomError('Something went wrong. Please try again');
        }
      },
      error: (err) => {
        this.snackbarService.showError(err);
      },
    });
  }
}

export class PasswordErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control?.invalid && control?.parent?.dirty);
    const invalidParent = !!(control?.parent?.invalid && control?.parent?.dirty);
    return invalidCtrl || invalidParent;
  }
}
