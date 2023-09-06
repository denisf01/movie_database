import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Movie } from '../../models/movie.model';
import { MovieService } from '../../services/movie.service';
import { ReviewService } from '../../../review/services/review.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.scss'],
})
export class MovieDetailsComponent implements OnInit {
  movie: Movie;
  open = new BehaviorSubject<boolean>(true);
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private movieService: MovieService,
    private reviewService: ReviewService
  ) {}

  ngOnInit() {
    this.movie = this.movieService.getMovie(+this.route.snapshot.params['id']);
    this.movieService.movieSubject.subscribe((movies: Movie[]) => {
      if (!!movies) this.movie = movies.find((el) => el.id === this.movie.id);
    });
    this.open.subscribe((value) => {
      if (!value) this.onClose();
    });
  }

  onClose() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  getUrl() {
    return `url(${this.movie.img_url})`;
  }
}
