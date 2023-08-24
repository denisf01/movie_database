import { NgModule } from '@angular/core';
import { MovieFormComponent } from './components/movie-form/movie-form.component';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [MovieFormComponent],
  imports: [
    CommonModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatButtonModule,
  ],
  exports: [MovieFormComponent],
})
export class AdminModule {}
