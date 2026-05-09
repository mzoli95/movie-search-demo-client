import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, debounceTime, distinctUntilChanged, map, of, switchMap } from 'rxjs';

import { MovieService } from '../../services/movie.service';
import * as MovieActions from './movie.actions';

const AUTOCOMPLETE_INITIAL_LIMIT = 10;

@Injectable()
export class MovieEffects {
  private readonly actions$ = inject(Actions);
  private readonly movieService = inject(MovieService);

  readonly searchMovies$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MovieActions.searchMovies),
      switchMap(({ query, provider, page, pageSize }) =>
        this.movieService.searchMovies(query, provider, page, pageSize).pipe(
          map((response) =>
            MovieActions.searchMoviesSuccess({
              movies: response.movies,
              totalResults: response.totalResults,
              currentPage: response.currentPage,
              pageSize: response.pageSize,
            }),
          ),
          catchError(() =>
            of(
              MovieActions.searchMoviesFailure({
                error: 'Hiba történt a filmek lekérése közben.',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  readonly autocompleteQueryChanged$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MovieActions.autocompleteQueryChanged),
      map(({ query }) => query.trim()),
      debounceTime(500),
      distinctUntilChanged(),
      map((query) =>
        query
          ? MovieActions.loadAutocompleteSuggestions({ query, limit: AUTOCOMPLETE_INITIAL_LIMIT })
          : MovieActions.clearAutocompleteSuggestions(),
      ),
    ),
  );

  readonly loadAutocompleteSuggestions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MovieActions.loadAutocompleteSuggestions),
      switchMap(({ query, limit }) =>
        this.movieService.getAutocompleteSuggestions(query, limit).pipe(
          map((suggestions) => MovieActions.loadAutocompleteSuggestionsSuccess({ suggestions, limit })),
          catchError(() =>
            of(
              MovieActions.loadAutocompleteSuggestionsFailure({
                error: 'Hiba történt az automatikus kiegészítés betöltése közben.',
              }),
            ),
          ),
        ),
      ),
    ),
  );
}
