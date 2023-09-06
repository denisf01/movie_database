import { Injectable } from '@angular/core';
import { MovieService } from '../../movie/services/movie.service';
import { Movie } from '../../movie/models/movie.model';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AdminService {
  constructor(private movieService: MovieService, private http: HttpClient) {}

  removeMovie(id: number) {
    this.movieService.movies = this.movieService.movies.filter(
      (movie) => movie.id !== id
    );
    this.movieService.removeFromWatchlist(id);
    this.movieService.movieSubject.next(this.movieService.getMovies());
    this.http.delete('/api/movies/' + id).subscribe();
  }
  addMovie(movie: Movie) {
    this.http
      .post('/api/movies', {
        title: movie.title,
        description: movie.description,
        img_url: movie.img_url,
        release_year: movie.release_year,
        genres: movie.genres.map((genre) => {
          return { id: genre.id };
        }),
      })
      .subscribe((result: any) => {
        movie.id = result.id;
        this.movieService.movies.push(movie);
        this.movieService.movieSubject.next(this.movieService.getMovies());
      });
  }
  editMovie(movie: Movie) {
    const index = this.movieService.movies.findIndex(
      (el) => el.id === movie.id
    );
    if (index === -1) return;
    this.movieService.movies[index] = movie;
    this.movieService.movieSubject.next(this.movieService.getMovies());
    this.http
      .put('/api/movies/' + movie.id, {
        id: movie.id,
        title: movie.title,
        description: movie.description,
        img_url: movie.img_url,
        release_year: movie.release_year,
        genres: movie.genres.map((genre) => {
          return { id: genre.id };
        }),
      })
      .subscribe();
  }
}
