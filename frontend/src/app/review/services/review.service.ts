import { Injectable } from '@angular/core';
import { Review } from '../models/review.model';
import { MovieService } from '../../movie/services/movie.service';
import { Movie } from '../../movie/models/movie.model';

@Injectable({ providedIn: 'root' })
export class ReviewService {
  constructor(private movieService: MovieService) {}

  getReviews(movie: Movie) {
    return this.movieService
      .getMovies()
      .find((item) => item.id === movie.id)
      .reviews.slice();
  }

  getRating(movie: Movie) {
    return this.movieService.movies.find((el) => el.id === movie.id)
      .rating_value;
  }

  addReview(movie: Movie, review: Review, onError: () => void) {
    const index = this.movieService.movies.findIndex(
      (el) => el.id === movie.id
    );
    if (
      this.movieService.movies[index].reviews.findIndex(
        (el) => el.userEmail === review.userEmail
      ) !== -1
    ) {
      onError(); // if user already left review
      return;
    }

    this.movieService.movies[index].reviews.push(review);
    const ratingCount = this.movieService.movies[index].reviews.length;
    const newRatingValue =
      (this.movieService.movies[index].rating_value * (ratingCount - 1) +
        review.rating) /
      ratingCount;
    this.movieService.movies[index].rating = +newRatingValue.toFixed(2);
    this.movieService.movieSubject.next(this.movieService.movies.slice());
  }
}
