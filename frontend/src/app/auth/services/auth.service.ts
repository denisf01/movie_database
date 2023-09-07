import { Injectable, OnInit } from '@angular/core';
import { User } from '../models/user.model';
import { BehaviorSubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import {
  HttpClient,
  HttpErrorResponse,
  HttpResponse,
} from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AuthService {
  loggedInUser = new BehaviorSubject<User>(null);
  get isAdmin() {
    return this.loggedInUser.getValue().id === 0;
  }
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  login(email: string, password: string) {
    return new Promise((resolve, reject) => {
      this.http
        .post('/api/users/login', {
          email,
          password,
        })
        .subscribe(
          (result: { id: number; email: string; password: string }) => {
            const user = new User(result.id, result.email, result.password);
            resolve(null);
            this.loggedInUser.next(user);
            localStorage.setItem('user', JSON.stringify(user));
          },
          (error) => {
            reject(new Error(error.error.message));
          }
        );
    });
  }

  register(email: string, password: string) {
    return new Promise((resolve, reject) => {
      this.http
        .post('/api/users/register', {
          email,
          password,
        })
        .subscribe(
          (response: HttpResponse<any>) => {
            resolve(null);
          },
          (error: HttpErrorResponse) => {
            reject(new Error(error.error.message));
          }
        );
    });
  }

  logout() {
    this.loggedInUser.next(null);
    localStorage.removeItem('user');
  }

  autoLogin() {
    const user: { _id: number; _email: string; _password: string } = JSON.parse(
      localStorage.getItem('user')
    );
    if (!!user)
      this.login(user._email, user._password).then(() => {
        this.router.navigate(['movies'], { relativeTo: this.route });
      });
  }
}
