import { Component, Input, OnInit } from '@angular/core';
import { Review } from '../../models/review.model';
import { ReviewService } from '../../services/review.service';
import { AuthService } from '../../../auth/services/auth.service';
import { Movie } from '../../../movie/models/movie.model';
import { MovieService } from '../../../movie/services/movie.service';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss'],
})
export class ReviewComponent implements OnInit {
  reviews: Review[];
  rating: number;
  error: string;
  @Input()
  movie: Movie;
  constructor(
    private reviewService: ReviewService,
    public authService: AuthService,
    private movieService: MovieService
  ) {}
  ngOnInit() {
    this.reviews = this.reviewService.getReviews(this.movie);
    this.movieService.movieSubject.subscribe((movies: Movie[]) => {
      this.reviews = this.reviewService.getReviews(this.movie);
    });
  }

  onSubmit(reviewInput: HTMLTextAreaElement) {
    this.reviewService.addReview(
      this.movie,
      new Review(
        -1,
        this.authService.loggedInUser.value.email,
        reviewInput.value,
        this.rating
      ),
      () => {
        this.error = 'You already wrote a review!';
      }
    );
    reviewInput.value = '';
  }
  onRatingChanged(rating: number) {
    this.rating = rating;
  }
  onReviewDelete(review: Review) {
    this.reviewService.deleteReview(review.id);
    this.error = '';
  }
}
