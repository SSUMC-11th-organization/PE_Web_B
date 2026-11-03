import type { TmdbMovieListItem } from "../../api/movies/models";
import { getTmdbPosterUrl } from "./tmdb-image";
export function toMovieCard(movie: TmdbMovieListItem, isBookmarked = false) {
  return { id: movie.id, title: movie.title, releaseDate: movie.release_date,
    posterPath: getTmdbPosterUrl(movie.poster_path), isBookmarked };
}
