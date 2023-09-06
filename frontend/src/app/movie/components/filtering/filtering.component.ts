import { Component, Input, OnInit } from '@angular/core';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { Genre } from '../../models/genre.model';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MovieService } from '../../services/movie.service';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { BehaviorSubject } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-filtering',
  templateUrl: './filtering.component.html',
  styleUrls: ['./filtering.component.scss'],
  imports: [
    ModalComponent,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    CommonModule,
    MatButtonModule,
    MatSlideToggleModule,
    FormsModule,
  ],
})
export class FilteringComponent implements OnInit {
  @Input()
  open: BehaviorSubject<boolean>;
  sortByRating: boolean = false;

  genreInput = new FormControl<Genre[]>([]);

  genreList: Genre[];
  constructor(private movieService: MovieService) {}
  ngOnInit() {
    this.genreList = this.movieService.getGenres();
    this.genreInput.setValue(this.movieService.getMovieFilter().filterGenres);
    this.sortByRating = this.movieService.getMovieFilter().sortByRating;
    this.movieService.genreSubject.subscribe((genres: Genre[]) => {
      this.genreList = genres;
    });
  }
  onChange() {
    const oldFilter = this.movieService.getMovieFilter();
    this.movieService.setMovieFilter({
      ...oldFilter,
      sortByRating: this.sortByRating,
    });
  }
  onSubmit() {
    this.movieService.setMovieFilter({
      ...this.movieService.getMovieFilter(),
      filterGenres: this.genreInput.value,
    });
  }
  onReset() {
    this.genreInput.reset([]);
    this.onSubmit();
  }
}
