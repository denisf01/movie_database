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
import { Filter, MovieService } from '../movie/services/movie.service';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../shared/components/modal/modal.component';
import { MovieModule } from '../movie/movie.module';
import { FilteringComponent } from '../movie/components/filtering/filtering.component';
import { BehaviorSubject, Subject } from 'rxjs';

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
    FilteringComponent,
    RouterLink,
    UpperCasePipe,
    NgIf,
  ],
})
export class HeaderComponent implements OnInit {
  openModal = new BehaviorSubject<boolean>(false);
  value: Filter = {
    search: '',
    sortByRating: false,
    filterGenres: [],
  };
  isAdmin: boolean;
  constructor(
    private authService: AuthService,
    private movieService: MovieService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.isAdmin = this.authService.isAdmin;
    this.value = this.movieService.getMovieFilter();
  }

  onLogout() {
    this.authService.logout();
  }

  onFilterClick() {}
  // onSearchClick(searchInput: HTMLInputElement) {
  //   this.movieService.setMovieFilter(searchInput.value);
  // }

  onAdd() {
    this.router.navigate(['add'], { relativeTo: this.route });
  }
  onChange() {
    this.movieService.setMovieFilter(this.value);
  }
}
