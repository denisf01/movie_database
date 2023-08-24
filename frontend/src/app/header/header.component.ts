import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { NgIf, UpperCasePipe } from '@angular/common';
import { AuthService } from '../auth/services/auth.service';
import { MovieService } from '../movie/services/movie.service';
import { FormsModule } from '@angular/forms';

/**
 * @title Toolbar overview
 */
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    FormsModule,
    RouterLinkActive,
    RouterLink,
    UpperCasePipe,
    NgIf,
  ],
})
export class HeaderComponent implements OnInit {
  value: string = '';
  isAdmin: boolean;
  constructor(
    private authService: AuthService,
    private movieService: MovieService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.isAdmin = this.authService.isAdmin;
  }

  onLogout() {
    this.authService.logout();
  }

  onSearchClick() {
    this.movieService.setMovieFilter(this.value);
  }
  // onSearchClick(searchInput: HTMLInputElement) {
  //   this.movieService.setMovieFilter(searchInput.value);
  // }
  onClear() {
    this.value = '';
    this.movieService.setMovieFilter('');
  }
  onAdd() {
    this.router.navigate(['add'], { relativeTo: this.route });
  }
}
