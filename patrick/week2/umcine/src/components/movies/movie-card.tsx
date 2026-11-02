import { Link } from "@tanstack/react-router";
import type { MovieCardItem } from "../../types/movie-card";
import { BookmarkButton } from "../bookmark-button";

interface MovieCardProps {
  movie: MovieCardItem;
}

export function MovieCard({ movie }: MovieCardProps) {
  return (
    <article className="flex flex-col gap-2.5 text-left">
      <Link to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
        <div className="relative">
          {movie.posterUrl ? (
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="w-full aspect-[2/3] object-cover rounded-2xl bg-gray-200"
            />
          ) : (
            <div className="flex w-full aspect-[2/3] items-center justify-center rounded-2xl bg-gray-200 text-sm text-gray-500">
              이미지 없음
            </div>
          )}
          <BookmarkButton
            movieId={movie.id}
            className="absolute right-2 top-2"
          />
        </div>
        <h2 className="m-0 text-sm font-bold leading-[1.35]">{movie.title}</h2>
      </Link>
      <p className="m-0 text-gray-400 text-xs">{movie.releaseDate}</p>
    </article>
  );
}