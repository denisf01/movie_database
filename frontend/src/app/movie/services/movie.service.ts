import { Injectable } from '@angular/core';
import { Movie } from '../models/movie.model';
import { Genre } from '../models/genre.model';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MovieService {
  genres: Genre[] = [
    new Genre('Biography'),
    new Genre('Drama'),
    new Genre('History'),
    new Genre('Action'),
    new Genre('Comedy'),
    new Genre('Horror'),
    new Genre('Crime'),
  ];
  public movies: Movie[] = [
    new Movie(
      0,
      'The Shawshank Redemption',
      'Over the course of several years, two convicts form a friendship, seeking consolation and, eventually, redemption through basic compassion.',
      0,
      'https://m.media-amazon.com/images/I/51zUbui+gbL._AC_UF894,1000_QL80_.jpg',
      1994,
      [this.genres[1]]
    ),
    new Movie(
      1,
      'The Godfather',
      'Don Vito Corleone, head of a mafia family, decides to hand over his empire to his youngest son Michael. However, his decision unintentionally puts the lives of his loved ones in grave danger.',
      0,
      'https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg',
      1972,
      [this.genres[1], this.genres[6]]
    ),
    new Movie(
      2,
      'The Dark Knight',
      'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
      0,
      'https://musicart.xboxlive.com/7/abb02f00-0000-0000-0000-000000000002/504/image.jpg?w=1920&h=1080',
      2008,
      [this.genres[1], this.genres[6], this.genres[3]]
    ),
    new Movie(
      3,
      "Schindler's List",
      'In German-occupied Poland during World War II, industrialist Oskar Schindler gradually becomes concerned for his Jewish workforce after witnessing their persecution by the Nazis.',
      0,
      'https://flxt.tmsimg.com/assets/p15227_p_v13_be.jpg',
      1993,
      [this.genres[0], this.genres[1], this.genres[2]]
    ),
    new Movie(
      4,
      'Oppenheimer',
      'The story of American scientist, J. Robert Oppenheimer, and his role in the development of the atomic bomb.',
      0,
      'https://m.media-amazon.com/images/M/MV5BMDBmYTZjNjUtN2M1MS00MTQ2LTk2ODgtNzc2M2QyZGE5NTVjXkEyXkFqcGdeQXVyNzAwMjU2MTY@._V1_.jpg',
      2023,
      [this.genres[0], this.genres[1], this.genres[2]]
    ),
  ];

  movieSubject = new Subject<Movie[]>();
  watchlistSubject = new Subject<Movie[]>();

  private movieFilter: Filter = {
    search: '',
    sortByRating: false,
    filterGenres: [],
  };

  private watchlist: Movie[] = [];

  setMovieFilter(filter: Filter) {
    this.movieFilter = filter;
    this.movieSubject.next(this.getMovies());
    this.watchlistSubject.next(this.getWatchlist());
  }

  addToWatchlist(movie: Movie) {
    this.watchlist.push(movie);
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
  }
  getWatchlist() {
    return this.watchlist
      .filter((movie) => {
        return (
          movie.title.includes(this.movieFilter.search) &&
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
          movie.title.includes(this.movieFilter.search) &&
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

  removeMovie(id: number) {
    this.movies = this.movies.filter((movie) => movie.id !== id);
    this.removeFromWatchlist(id);
    this.movieSubject.next(this.getMovies());
  }
  addMovie(movie: Movie) {
    this.movies.push(movie);
    this.movieSubject.next(this.getMovies());
  }
  editMovie(movie: Movie) {
    const index = this.movies.findIndex((el) => el.id === movie.id);
    if (index === -1) return;
    this.movies[index] = movie;
    this.movieSubject.next(this.getMovies());
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
