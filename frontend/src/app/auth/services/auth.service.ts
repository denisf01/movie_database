import { Injectable, OnInit } from '@angular/core';
import { User } from '../models/user.model';
import { BehaviorSubject, map, Subject, take } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  users: User[] = [
    new User('test@test.com', '123456'),
    new User('admin@admin.com', 'adminadmin'),
  ];
  loggedInUser = new BehaviorSubject<User>(null);
  get isAdmin() {
    return this.loggedInUser.getValue().email === 'admin@admin.com';
  }
  constructor(private route: ActivatedRoute, private router: Router) {}

  login(email: string, password: string) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = this.users.find((user) => user.email === email);
        if (!!user) {
          if (user.password === password) {
            resolve(null);
            this.loggedInUser.next(user);
            localStorage.setItem('user', JSON.stringify(user));
            return;
          }
        }
        reject(new Error('Login error'));
      }, 1);
    });
  }

  register(email: string, password: string) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (this.users.findIndex((user) => user.email === email) !== -1) {
          reject(new Error('User already exists!'));
        }
        this.users.push(new User(email, password));
        resolve(null);
      }, 1);
    });
  }

  logout() {
    this.loggedInUser.next(null);
    localStorage.removeItem('user');
  }

  autoLogin() {
    const user: { _email: string; _password: string } = JSON.parse(
      localStorage.getItem('user')
    );
    if (!!user)
      this.login(user._email, user._password).then(() => {
        this.router.navigate(['movies'], { relativeTo: this.route });
      });
  }
}
