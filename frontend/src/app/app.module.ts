import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthComponent } from './auth/components/login-register/auth.component';
import { LoginFormComponent } from './auth/components/login-form/login-form.component';
import { MovieListComponent } from './movie/components/movie-list/movie-list.component';
import { MovieItemComponent } from './movie/components/movie-item/movie-item.component';
import { MatGridListModule } from '@angular/material/grid-list';

@NgModule({
  declarations: [AppComponent, AuthComponent, MovieListComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LoginFormComponent,
    MovieItemComponent,
    MatGridListModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
