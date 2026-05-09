import { ChangeDetectionStrategy, Component, DestroyRef, ViewChild, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { fromEvent, Subscription, throttleTime } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import {
  MatAutocompleteModule,
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger,
} from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { MovieApiProvider } from '../models/movie-api-provider.enum';
import * as MovieActions from './+state/movie.actions';
import * as MovieSelectors from './+state/movie.selectors';

@Component({
  selector: 'app-movie',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './movie.html',
  styleUrl: './movie.css',
})
export class MovieComponent {
  private readonly store = inject(Store);
  private readonly destroyRef = inject(DestroyRef);
  private autocompleteScrollSubscription: Subscription | null = null;

  @ViewChild('movieAutocomplete')
  private autocompletePanel?: MatAutocomplete;

  @ViewChild(MatAutocompleteTrigger)
  private autocompleteTrigger?: MatAutocompleteTrigger;

  readonly form = new FormGroup({
    searchQuery: new FormControl('', { nonNullable: true }),
    provider: new FormControl<MovieApiProvider>(MovieApiProvider.Omdb, { nonNullable: true }),
  });

  readonly searchQuery = signal('');
  readonly selectedProvider = signal<MovieApiProvider>(MovieApiProvider.Omdb);

  constructor() {
    this.form.controls.searchQuery.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((value) => {
        this.searchQuery.set(value);
        this.store.dispatch(MovieActions.autocompleteQueryChanged({ query: value }));
      });

    this.form.controls.provider.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((value) => this.selectedProvider.set(value));
  }

  readonly movies = this.store.selectSignal(MovieSelectors.selectMovies);
  readonly totalResults = this.store.selectSignal(MovieSelectors.selectTotalResults);
  readonly loading = this.store.selectSignal(MovieSelectors.selectLoading);
  readonly error = this.store.selectSignal(MovieSelectors.selectError);
  readonly currentPage = this.store.selectSignal(MovieSelectors.selectCurrentPage);
  readonly pageSize = this.store.selectSignal(MovieSelectors.selectPageSize);
  readonly autocompleteSuggestions = this.store.selectSignal(
    MovieSelectors.selectAutocompleteSuggestions,
  );
  readonly autocompleteLoading = this.store.selectSignal(MovieSelectors.selectAutocompleteLoading);
  readonly autocompleteLimit = this.store.selectSignal(MovieSelectors.selectAutocompleteLimit);
  readonly autocompleteHasMore = this.store.selectSignal(MovieSelectors.selectAutocompleteHasMore);

  private readonly lastQuery = this.store.selectSignal(MovieSelectors.selectQuery);
  private readonly lastProvider = this.store.selectSignal(MovieSelectors.selectProvider);

  readonly apiProviders = [
    { label: 'OMDb', value: MovieApiProvider.Omdb },
    { label: 'TMDb', value: MovieApiProvider.Tmdb },
  ] as const;

  readonly displayedColumns = ['title', 'year', 'director'] as const;

  search(): void {
    const query = this.searchQuery().trim();
    if (!query) return;

    this.store.dispatch(
      MovieActions.searchMovies({
        query,
        provider: this.selectedProvider(),
        page: 1,
        pageSize: this.pageSize(),
      }),
    );
  }

  onPageChange(event: PageEvent): void {
    this.store.dispatch(
      MovieActions.searchMovies({
        query: this.lastQuery(),
        provider: this.lastProvider(),
        page: event.pageIndex + 1,
        pageSize: event.pageSize,
      }),
    );
  }

  onAutocompleteSelected(event: MatAutocompleteSelectedEvent): void {
    const value = event.option.value as string;
    this.form.controls.searchQuery.setValue(value);
    this.search();
  }

  onAutocompleteOpened(): void {
    this.autocompleteScrollSubscription?.unsubscribe();

    const panel = this.autocompletePanel?.panel?.nativeElement;
    if (!panel) {
      return;
    }

    this.autocompleteScrollSubscription = fromEvent(panel, 'scroll')
      .pipe(throttleTime(200), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        const nearBottom = panel.scrollTop + panel.clientHeight >= panel.scrollHeight - 16;
        if (!nearBottom || this.autocompleteLoading() || !this.autocompleteHasMore()) {
          return;
        }

        this.store.dispatch(
          MovieActions.loadAutocompleteSuggestions({
            query: this.searchQuery().trim(),
            limit: this.autocompleteLimit() + 10,
          }),
        );
      });
  }

  onAutocompleteClosed(): void {
    this.autocompleteScrollSubscription?.unsubscribe();
    this.autocompleteScrollSubscription = null;
  }
}
