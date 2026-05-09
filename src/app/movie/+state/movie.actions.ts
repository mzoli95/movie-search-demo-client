import { createAction, props } from '@ngrx/store';
import { MovieApiProvider } from '../../models/movie-api-provider.enum';
import { MovieDto } from '../../models/movie.dto';

export const searchMovies = createAction(
  '[Movie] Search',
  props<{ query: string; provider: MovieApiProvider; page: number; pageSize: number }>(),
);

export const searchMoviesSuccess = createAction(
  '[Movie] Search Success',
  props<{ movies: MovieDto[]; totalResults: number; currentPage: number; pageSize: number }>(),
);

export const searchMoviesFailure = createAction(
  '[Movie] Search Failure',
  props<{ error: string }>(),
);

export const autocompleteQueryChanged = createAction(
  '[Movie] Autocomplete Query Changed',
  props<{ query: string }>(),
);

export const loadAutocompleteSuggestions = createAction(
  '[Movie] Load Autocomplete Suggestions',
  props<{ query: string; limit: number }>(),
);

export const loadAutocompleteSuggestionsSuccess = createAction(
  '[Movie] Load Autocomplete Suggestions Success',
  props<{ suggestions: string[]; limit: number }>(),
);

export const loadAutocompleteSuggestionsFailure = createAction(
  '[Movie] Load Autocomplete Suggestions Failure',
  props<{ error: string }>(),
);

export const clearAutocompleteSuggestions = createAction('[Movie] Clear Autocomplete Suggestions');
