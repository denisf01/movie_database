import { Injectable } from '@angular/core';
import { Movie } from '../models/movie.model';
import { Genre } from '../models/genre.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Review } from '../../review/models/review.model';
import { AuthService } from '../../auth/services/auth.service';

@Injectable({ providedIn: 'root' })
export class MovieService {
  genres: Genre[] = [];
  public movies: Movie[] = [];

  movieSubject = new Subject<Movie[]>();
  watchlistSubject = new Subject<Movie[]>();
  genreSubject = new Subject<Genre[]>();

  private movieFilter: Filter = {
    search: '',
    sortByRating: false,
    filterGenres: [],
  };

  private watchlist: Movie[] = [];

  constructor(private http: HttpClient, private authService: AuthService) {
    this.http.get('/api/genres').subscribe((result: any[]) => {
      for (let genre of result) {
        this.genres.push(new Genre(genre.id, genre.name));
      }
      this.genreSubject.next(this.genres);
    });
    this.http.get('/api/movies').subscribe((result: any[]) => {
      for (let movie of result)
        this.movies.push(
          new Movie(
            movie.id,
            movie.title,
            movie.description,
            movie.img_url,
            movie.release_year,
            movie.genres.map((genre) =>
              this.genres.find((el) => el.id === genre.id)
            ),
            movie.reviews.map(
              (review) =>
                new Review(
                  review.id,
                  review.userEmail,
                  review.message,
                  review.rating
                )
            )
          )
        );
      this.movieSubject.next(this.getMovies());
    });
    this.http
      .get('/api/watchlist/' + this.authService.loggedInUser.value.id)
      .subscribe((movies: any[]) => {
        for (let movie of movies) {
          this.watchlist.push(
            this.movies.find((el) => el.id === movie.movie_id)
          );
        }
        this.watchlistSubject.next(this.getWatchlist());
      });
  }

  setMovieFilter(filter: Filter) {
    this.movieFilter = filter;
    this.movieSubject.next(this.getMovies());
    this.watchlistSubject.next(this.getWatchlist());
  }

  addToWatchlist(movie: Movie) {
    this.watchlist.push(movie);
    this.http
      .post('/api/watchlist', {
        user_id: this.authService.loggedInUser.value.id,
        movie_id: movie.id,
      })
      .subscribe();
  }

  getGenres() {
    return this.genres.slice();
  }
  getMovieFilter() {
    return this.movieFilter;
  }
  removeFromWatchlist(id: number) {
    this.watchlist = this.watchlist.filter((movie) => movie.id !== id);
    this.watchlistSubject.next(this.getWatchlist());
    this.http
      .delete(`/api/watchlist/${this.authService.loggedInUser.value.id}/${id}`)
      .subscribe();
  }
  getWatchlist() {
    return this.watchlist
      .filter((movie) => {
        return (
          movie.title
            .toUpperCase()
            .includes(this.movieFilter.search.toUpperCase()) &&
          this.filterGenres(this.movieFilter.filterGenres, movie)
        );
      })
      .sort((el1, el2) => {
        if (this.movieFilter.sortByRating) {
          return el2.rating_value - el1.rating_value;
        } else {
          if (el1.title.toUpperCase() > el2.title.toUpperCase()) return 1;
          if (el1.title.toUpperCase() < el2.title.toUpperCase()) return -1;
          return 0;
        }
      });
  }
  getMovies() {
    return this.movies
      .filter((movie) => {
        return (
          movie.title
            .toUpperCase()
            .includes(this.movieFilter.search.toUpperCase()) &&
          this.filterGenres(this.movieFilter.filterGenres, movie)
        );
      })
      .sort((el1, el2) => {
        if (this.movieFilter.sortByRating) {
          return el2.rating_value - el1.rating_value;
        } else {
          if (el1.title.toUpperCase() > el2.title.toUpperCase()) return 1;
          if (el1.title.toUpperCase() < el2.title.toUpperCase()) return -1;
          return 0;
        }
      });
  }
  getMovie(id: number) {
    return this.movies.find((movie) => movie.id === id);
  }

  checkWatchlist(id: number) {
    return this.watchlist.findIndex((movie) => movie.id === id) !== -1;
  }

  private filterGenres(genres: Genre[], movie: Movie) {
    for (let genre of genres) {
      if (!movie.genres.includes(genre)) return false;
    }
    return true;
  }
}

export interface Filter {
  search: string;
  sortByRating: boolean;
  filterGenres: Genre[];
}
