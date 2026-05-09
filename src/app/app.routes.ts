import { Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';

import { HomeComponent } from './home/home';
import { MovieEffects } from './movie/+state/movie.effects';
import { movieFeature } from './movie/+state/movie.reducer';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'movies',
    providers: [provideState(movieFeature), provideEffects(MovieEffects)],
    loadComponent: () => import('./movie/movie').then((m) => m.MovieComponent),
  },
  { path: '**', redirectTo: '' },
];
