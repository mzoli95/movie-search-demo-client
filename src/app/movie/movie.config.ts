import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';

import { MovieEffects } from './+state/movie.effects';
import { movieFeature } from './+state/movie.reducer';

export function provideMovieFeature(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideStore({ [movieFeature.name]: movieFeature.reducer }),
    provideEffects(MovieEffects),
  ]);
}
