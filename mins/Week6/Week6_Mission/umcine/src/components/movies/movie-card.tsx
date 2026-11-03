import { MovieImage } from "./movie-image";
import { Link } from "@tanstack/react-router";
import type { toMovieCard } from "../../utils/movies/movie-adapter";
type Movie = ReturnType<typeof toMovieCard>;
import { cn } from "../../utils/cn";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (movieId: number) => void;
}

export default function MovieCard({
  movie,
  onToggleBookmark,
}: MovieCardProps) {
  return (
    <article className="min-w-0">
      <div className="relative h-[274px] w-full overflow-hidden rounded-[10px] bg-[#f6f7f9]">
        <Link
          className="block h-full w-full"
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
        >
          <MovieImage
            className="block h-full w-full object-cover"
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
          />
        </Link>

        <button
          className={cn(
            "absolute right-[10px] top-[10px] flex h-[34px] w-[34px] cursor-pointer items-center justify-center rounded-lg border border-white bg-[#17191e] p-0",
            movie.isBookmarked && "border-[#2563eb] bg-[#2563eb]",
          )}
          type="button"
          aria-label={`${movie.title} 북마크 ${
            movie.isBookmarked ? "해제" : "추가"
          }`}
          aria-pressed={movie.isBookmarked}
          onClick={() => onToggleBookmark(movie.id)}
        >
          <img
            className="block h-6 w-6 brightness-0 invert"
            src={
              movie.isBookmarked
                ? "/icons/bookmark.svg"
                : "/icons/bookmark-outline.svg"
            }
            alt=""
          />
        </button>
      </div>

      <Link
        to="/movies/$movieId"
        params={{ movieId: String(movie.id) }}
      >
        <h2 className="mt-[9px] truncate text-sm font-extrabold text-[#17191e]">{movie.title}</h2>
      </Link>

      <p className="mt-1 text-xs text-[#969da8]">{movie.releaseDate}</p>
    </article>
  );
}
