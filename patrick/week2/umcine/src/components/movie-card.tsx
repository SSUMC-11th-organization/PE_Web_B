import "./movie-card.css";
import type { Movie } from "../types/movie";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (movieId: number) => void;
}

export function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  return (
    <article className="movie-card">
      <div className="movie-card__poster">
        <img src={movie.posterPath} alt={movie.title} />
        <button
          type="button"
          className="movie-card__bookmark"
          onClick={() => onToggleBookmark(movie.id)}
          aria-pressed={movie.isBookmarked}
          aria-label={movie.isBookmarked ? "북마크 해제" : "북마크 추가"}
        >
          <img
            src={
              movie.isBookmarked
                ? "/icons/bookmark.svg"
                : "/icons/bookmark-outline.svg"
            }
            alt=""
          />
        </button>
      </div>
      <h2>{movie.title}</h2>
      <p>{movie.releaseDate}</p>
    </article>
  );
}
