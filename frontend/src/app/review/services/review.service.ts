import { Injectable, OnInit } from '@angular/core';
import { Review } from '../models/review.model';
import { MovieService } from '../../movie/services/movie.service';
import { Movie } from '../../movie/models/movie.model';
import { AuthService } from '../../auth/services/auth.service';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ReviewService {
  constructor(
    private movieService: MovieService,
    private authService: AuthService,
    private http: HttpClient
  ) {}

  getReviews(movie: Movie) {
    return this.movieService.getMovies().find((item) => item.id === movie.id)
      ?.reviews;
  }

  getRating(movie: Movie) {
    return this.movieService.movies.find((el) => el.id === movie.id)
      .rating_value;
  }
  deleteReview(id: number) {
    this.http.delete('/api/reviews/' + id).subscribe(() => {
      this.movieService.movies = this.movieService.movies.map((movie) => {
        const newValue = new Movie(
          movie.id,
          movie.title,
          movie.description,
          movie.img_url,
          movie.release_year,
          movie.genres,
          movie.reviews.filter((review) => review.id !== id)
        );

        return newValue;
      });
      this.movieService.movieSubject.next(this.movieService.getMovies());
    });
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
    this.http
      .post('/api/reviews', {
        user_id: this.authService.loggedInUser.value.id,
        movie_id: movie.id,
        rating_value: review.rating,
        review_text: review.message,
      })
      .subscribe((result: { id: number }) => {
        review.id = result.id;
        this.movieService.movies[index].reviews.push(review);
        this.movieService.movieSubject.next(this.movieService.getMovies());
      });
  }
}
