import { NgModule } from '@angular/core';
import { MovieListComponent } from './components/movie-list/movie-list.component';
import { MovieItemComponent } from './components/movie-item/movie-item.component';
import { RouterModule } from '@angular/router';
import { MatGridListModule } from '@angular/material/grid-list';
import { HeaderComponent } from '../header/header.component';
import { CommonModule } from '@angular/common';
import { MovieDetailsComponent } from './components/movie-details/movie-details.component';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { RatingComponent } from './components/rating/rating.component';
import { ReviewComponent } from '../review/components/review/review.component';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { WatchlistComponent } from './components/watchlist/watchlist.component';
import { AuthGuard } from '../auth/auth.guard';
import { AdminModule } from '../admin/admin.module';
import { MovieFormComponent } from '../admin/components/movie-form/movie-form.component';

@NgModule({
  declarations: [
    MovieListComponent,
    MovieDetailsComponent,
    MovieDetailsComponent,
    RatingComponent,
    ReviewComponent,
    WatchlistComponent,
  ],
  imports: [
    HeaderComponent,
    MatButtonModule,
    CommonModule,
    AdminModule,
    MovieItemComponent,
    MatTabsModule,
    MatIconModule,
    MatListModule,
    MatDividerModule,
    MatGridListModule,
    RouterModule.forChild([
      {
        path: 'watchlist',
        component: WatchlistComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'movies',
        component: MovieListComponent,
        canActivate: [AuthGuard],
        children: [
          {
            path: 'add',
            component: MovieFormComponent,
          },
          {
            path: ':id',
            component: MovieDetailsComponent,
          },
          {
            path: 'edit/:id',
            component: MovieFormComponent,
          },
        ],
      },
      {
        path: '**',
        redirectTo: 'movies',
      },
    ]),
    MatInputModule,
  ],
})
export class MovieModule {}
