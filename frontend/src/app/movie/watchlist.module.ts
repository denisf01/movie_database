import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WatchlistComponent } from './components/watchlist/watchlist.component';
import { AuthGuard } from '../auth/auth.guard';
import { HeaderComponent } from '../header/header.component';
import { MovieItemComponent } from './components/movie-item/movie-item.component';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [WatchlistComponent],
  imports: [
    CommonModule,
    MatListModule,
    HeaderComponent,
    MovieItemComponent,
    RouterModule.forChild([
      {
        path: '',
        component: WatchlistComponent,
        canActivate: [AuthGuard],
      },
    ]),
  ],
})
export class WatchlistModule {}
