import { Injectable } from '@angular/core';
import { MovieService } from '../../movie/services/movie.service';

@Injectable({ providedIn: 'root' })
export class AdminService {
  constructor(private movieService: MovieService) {}

  removeMovieFromList(id: number) {
    this.movieService.removeMovie(id);
  }
}
