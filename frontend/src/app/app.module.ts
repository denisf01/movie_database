import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthModule } from './auth/auth.module';
import { MovieModule } from './movie/movie.module';
import { MovieDetailsComponent } from './movie/components/movie-details/movie-details.component';
import { ReviewComponent } from './review/components/review/review.component';
import { MovieFormComponent } from './admin/components/movie-form/movie-form.component';
import { AdminModule } from './admin/admin.module';
import { ModalComponent } from './shared/components/modal/modal.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AuthModule,
    MovieModule,
    AdminModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
