import { NgModule } from '@angular/core';
import { AuthComponent } from './components/login-register/auth.component';
import { RouterModule } from '@angular/router';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [AuthComponent],
  imports: [
    LoginFormComponent,
    MatProgressSpinnerModule,
    MatIconModule,
    RouterModule.forChild([
      {
        path: 'auth',
        component: AuthComponent,
      },
    ]),
  ],
})
export class AuthModule {}
