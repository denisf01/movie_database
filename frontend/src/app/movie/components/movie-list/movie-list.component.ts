import { Component, OnInit } from '@angular/core';
import { Movie } from '../../models/movie.model';
import { MovieService } from '../../services/movie.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.scss'],
})
export class MovieListComponent implements OnInit {
  listRows: number;
  movies: Movie[];

  constructor(
    private movieService: MovieService,
    private router: Router,
    private route: ActivatedRoute,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.listRows = window.innerWidth <= 400 ? 1 : 5;
    this.movies = this.movieService.getMovies();
    this.movieService.movieSubject.subscribe((movies: Movie[]) => {
      this.movies = movies;
    });
  }

  onResize(event) {
    this.listRows = event.target.innerWidth <= 400 ? 1 : 5;
  }
  onMovieItemClick(movie: Movie) {
    this.router.navigate([`${movie.id}`], { relativeTo: this.route });
  }
  onButtonClick(movie: Movie) {
    if (this.movieService.checkWatchlist(movie.id))
      this.movieService.removeFromWatchlist(movie.id);
    else this.movieService.addToWatchlist(movie);
  }
}
