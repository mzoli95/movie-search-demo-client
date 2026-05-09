import { MovieDto } from './movie.dto';

export interface MovieSearchResponseDto {
  movies: MovieDto[];
  currentPage: number;
  pageSize: number;
  totalResults: number;
  totalPages: number;
}
