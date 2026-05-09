import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { MovieSearchResponseDto } from '../models/movie-search-response.dto';
import { MovieApiProvider } from '../models/movie-api-provider.enum';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private readonly baseUrl: string = 'https://localhost:44376';
  private readonly http = inject(HttpClient);

  searchMovies(
    movieTitle: string,
    api: MovieApiProvider,
    page: number,
    pageSize: number,
  ): Observable<MovieSearchResponseDto> {
    const params = new HttpParams().set('api', api).set('page', page).set('pageSize', pageSize);

    return this.http.get<MovieSearchResponseDto>(
      `${this.baseUrl}/movies/${encodeURIComponent(movieTitle)}`,
      { params },
    );
  }

  getAutocompleteSuggestions(query: string, limit = 10): Observable<string[]> {
    const params = new HttpParams().set('query', query).set('limit', limit);

    return this.http.get<string[]>(`${this.baseUrl}/movies/autocomplete`, { params });
  }
}
