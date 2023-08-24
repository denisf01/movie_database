import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatGridListModule } from '@angular/material/grid-list';
import { Movie } from '../../models/movie.model';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { AdminService } from '../../../admin/services/admin.service';

/**
 * @title Card with multiple sections
 */
@Component({
  selector: 'app-movie-item',
  templateUrl: './movie-item.component.html',
  styleUrls: ['./movie-item.component.scss'],
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatGridListModule,
    CommonModule,
  ],
})
export class MovieItemComponent {
  @Input()
  movie: Movie;
  @Input()
  isAdmin: boolean;
  @Output()
  buttonClickHandler = new EventEmitter<void>();

  onClick(event: Event) {
    event.stopPropagation();
    this.buttonClickHandler.emit();
  }
  onDelete(event: Event) {
    event.stopPropagation();
    this.adminService.removeMovieFromList(this.movie.id);
  }
  onEdit(event: Event) {
    event.stopPropagation();
    this.router.navigate(['edit', `${this.movie.id}`], {
      relativeTo: this.route,
    });
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public movieService: MovieService,
    private adminService: AdminService
  ) {}
}
