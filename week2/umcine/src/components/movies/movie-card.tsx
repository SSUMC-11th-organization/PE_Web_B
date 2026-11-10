import { Link } from "@tanstack/react-router";
import type { TmdbMovie } from "../../api/movies/models";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";
import { BookmarkButton } from "./bookmark-button";

interface MovieCardProps {
  movie: TmdbMovie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const posterUrl = getTmdbPosterUrl(movie.poster_path);

  return (
    <article className="flex flex-col gap-1">
      <div className="relative aspect-[241/274] overflow-hidden rounded-[10px] bg-page">
        <Link
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
          className="block size-full"
        >
          {posterUrl && (
            <img
              className="block size-full object-cover transition-transform duration-300 hover:scale-105"
              src={posterUrl}
              alt={`${movie.title} 포스터`}
            />
          )}
        </Link>

        <BookmarkButton
          movieId={movie.id}
          movieTitle={movie.title}
          className="absolute right-2.5 top-2.5"
        />
      </div>

      <h3 className="truncate pt-[5px] text-sm font-extrabold text-ink">
        <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
          {movie.title}
        </Link>
      </h3>
      <p className="text-xs text-ink-tertiary">{movie.release_date}</p>
    </article>
  );
}
