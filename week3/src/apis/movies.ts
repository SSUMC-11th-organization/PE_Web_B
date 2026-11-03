import { tmdbClient } from "./tmdb-client";
import type {
  Movie,
  MovieDetail,
  TmdbMovie,
  TmdbMovieDetail,
  TmdbPagedResponse,
} from "../types/movie";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

// TMDB는 500페이지까지만 조회할 수 있어요.
const MAX_PAGE = 500;

const toImageUrl = (path: string | null, size: string) =>
  path ? `${IMAGE_BASE_URL}/${size}${path}` : null;

// "2026-07-29" -> "2026.07.29"
const formatReleaseDate = (date: string) => (date ? date.replaceAll("-", ".") : "개봉일 미정");

// 145 -> "2시간 25분"
const formatRuntime = (minutes: number | null) => {
  if (!minutes) return "상영시간 미정";
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours === 0) return `${rest}분`;
  return rest === 0 ? `${hours}시간` : `${hours}시간 ${rest}분`;
};

const toMovie = (movie: TmdbMovie): Movie => ({
  id: movie.id,
  title: movie.title,
  originalTitle: movie.original_title,
  releaseDate: formatReleaseDate(movie.release_date),
  posterUrl: toImageUrl(movie.poster_path, "w500"),
  overview: movie.overview,
});

export interface MovieList {
  movies: Movie[];
  page: number;
  totalPages: number;
  totalResults: number;
}

const toMovieList = (response: TmdbPagedResponse<TmdbMovie>): MovieList => ({
  movies: response.results.map(toMovie),
  page: response.page,
  totalPages: Math.min(response.total_pages, MAX_PAGE),
  totalResults: response.total_results,
});

export async function getPopularMovies(page: number, signal?: AbortSignal): Promise<MovieList> {
  const response = await tmdbClient
    .get("movie/popular", { searchParams: { page }, signal })
    .json<TmdbPagedResponse<TmdbMovie>>();
  return toMovieList(response);
}

export async function searchMovies(query: string, signal?: AbortSignal): Promise<MovieList> {
  const response = await tmdbClient
    .get("search/movie", { searchParams: { query, page: 1 }, signal })
    .json<TmdbPagedResponse<TmdbMovie>>();
  return toMovieList(response);
}

export async function getMovieDetail(movieId: number, signal?: AbortSignal): Promise<MovieDetail> {
  const movie = await tmdbClient.get(`movie/${movieId}`, { signal }).json<TmdbMovieDetail>();
  return {
    ...toMovie(movie),
    backdropUrl: toImageUrl(movie.backdrop_path, "w1280"),
    genres: movie.genres.map((genre) => genre.name),
    runtime: formatRuntime(movie.runtime),
    tagline: movie.tagline,
  };
}
