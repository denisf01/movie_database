import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
  {
    path: 'movies',
    loadChildren: () =>
      import('./movie/movie.module').then((m) => m.MovieModule),
  },
  {
    path: 'watchlist',
    loadChildren: () =>
      import('./movie/watchlist.module').then((m) => m.WatchlistModule),
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
