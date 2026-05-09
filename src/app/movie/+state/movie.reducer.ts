import { createFeature, createReducer, on } from '@ngrx/store';

import { MovieApiProvider } from '../../models/movie-api-provider.enum';
import { MovieDto } from '../../models/movie.dto';
import * as MovieActions from './movie.actions';

export interface MovieState {
  movies: MovieDto[];
  totalResults: number;
  currentPage: number;
  pageSize: number;
  query: string;
  provider: MovieApiProvider;
  loading: boolean;
  error: string | null;
  autocompleteSuggestions: string[];
  autocompleteLoading: boolean;
  autocompleteError: string | null;
  autocompleteLimit: number;
  autocompleteHasMore: boolean;
}

const initialState: MovieState = {
  movies: [],
  totalResults: 0,
  currentPage: 1,
  pageSize: 10,
  query: '',
  provider: MovieApiProvider.Omdb,
  loading: false,
  error: null,
  autocompleteSuggestions: [],
  autocompleteLoading: false,
  autocompleteError: null,
  autocompleteLimit: 10,
  autocompleteHasMore: false,
};

const reducer = createReducer(
  initialState,
  on(MovieActions.searchMovies, (state, { query, provider, page, pageSize }) => ({
    ...state,
    query,
    provider,
    currentPage: page,
    pageSize,
    loading: true,
    error: null,
    autocompleteSuggestions: [],
    autocompleteLoading: false,
    autocompleteError: null,
    autocompleteLimit: 10,
    autocompleteHasMore: false,
  })),
  on(MovieActions.searchMoviesSuccess, (state, { movies, totalResults, currentPage, pageSize }) => ({
    ...state,
    movies,
    totalResults,
    currentPage,
    pageSize,
    loading: false,
  })),
  on(MovieActions.searchMoviesFailure, (state, { error }) => ({
    ...state,
    movies: [],
    totalResults: 0,
    loading: false,
    error,
  })),
  on(MovieActions.loadAutocompleteSuggestions, (state, { limit }) => ({
    ...state,
    autocompleteLoading: true,
    autocompleteError: null,
    autocompleteLimit: limit,
  })),
  on(MovieActions.loadAutocompleteSuggestionsSuccess, (state, { suggestions, limit }) => ({
    ...state,
    autocompleteSuggestions: suggestions,
    autocompleteLoading: false,
    autocompleteLimit: limit,
    autocompleteHasMore: suggestions.length >= limit,
  })),
  on(MovieActions.loadAutocompleteSuggestionsFailure, (state, { error }) => ({
    ...state,
    autocompleteSuggestions: [],
    autocompleteLoading: false,
    autocompleteError: error,
    autocompleteHasMore: false,
  })),
  on(MovieActions.clearAutocompleteSuggestions, (state) => ({
    ...state,
    autocompleteSuggestions: [],
    autocompleteLoading: false,
    autocompleteError: null,
    autocompleteLimit: 10,
    autocompleteHasMore: false,
  })),
);

export const movieFeature = createFeature({
  name: 'movie',
  reducer,
});
