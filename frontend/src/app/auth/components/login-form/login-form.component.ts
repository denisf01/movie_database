import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
} from '@angular/forms';
import { NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { emailValidator } from './emailValidator';

/** @title Form field with error messages */
@Component({
  selector: 'login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
})
export class LoginFormComponent implements OnInit {
  loginForm: FormGroup;
  hide = true;
  isLogin = true;
  error: Error;
  isLoading = false;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.loginForm = new FormGroup<any>({
      email: new FormControl('', [Validators.required, emailValidator]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  getErrorMessage(field: string) {
    if (field === 'email') {
      if (this.loginForm.get('email')!.hasError('required')) {
        return 'You must enter a value';
      }

      return this.loginForm.get('email')!.hasError('email')
        ? 'Not a valid email'
        : '';
    } else {
      if (this.loginForm.get('password')!.hasError('required')) {
        return 'You must enter a value';
      }
      return 'Password must have at least 6 characters!';
    }
  }
  onSwitchButtonPressed() {
    this.isLogin = !this.isLogin;
  }
  onSubmit() {
    this.isLoading = true;
    if (this.isLogin) {
      this.authService
        .login(this.loginForm.value.email, this.loginForm.value.password)
        .then(() => {
          this.router.navigate(['../movies'], { relativeTo: this.route });
          this.error = null;
          this.loginForm.reset();
        })
        .catch((e: Error) => {
          this.error = e;
        })
        .finally(() => {
          this.isLoading = false;
        });
    } else {
      this.authService
        .register(this.loginForm.value.email, this.loginForm.value.password)
        .then(() => {
          this.isLogin = true;
          this.loginForm.reset();
        })
        .catch((e: Error) => {
          this.error = e;
        })
        .finally(() => {
          this.isLoading = false;
        });
    }
  }
}
