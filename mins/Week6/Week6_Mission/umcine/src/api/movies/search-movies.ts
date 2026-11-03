import { tmdbClient } from "../tmdb-client";
import type { TmdbMovieListResponse } from "./models";
export interface SearchMoviesRequest { query: string; page?: number }
export type SearchMoviesResponse = TmdbMovieListResponse;
export function searchMovies({ query, page = 1 }: SearchMoviesRequest) {
  return tmdbClient.get("search/movie", { searchParams: { language: "ko-KR", query, page, include_adult: false } }).json<SearchMoviesResponse>();
}
