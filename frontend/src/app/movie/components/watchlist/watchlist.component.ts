import { Component, OnInit } from '@angular/core';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../models/movie.model';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.scss'],
})
export class WatchlistComponent implements OnInit {
  watchlist: Movie[];
  constructor(private movieService: MovieService) {}
  ngOnInit() {
    this.watchlist = this.movieService.getWatchlist();
    this.movieService.watchlistSubject.subscribe((movies: Movie[]) => {
      this.watchlist = movies;
    });
  }
  onButtonClick(movie: Movie) {
    this.movieService.removeFromWatchlist(movie.id);
  }
}
