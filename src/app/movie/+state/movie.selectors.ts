import { movieFeature } from './movie.reducer';

export const {
  selectMovieState,
  selectMovies,
  selectTotalResults,
  selectCurrentPage,
  selectPageSize,
  selectQuery,
  selectProvider,
  selectLoading,
  selectError,
  selectAutocompleteSuggestions,
  selectAutocompleteLoading,
  selectAutocompleteError,
  selectAutocompleteLimit,
  selectAutocompleteHasMore,
} = movieFeature;
