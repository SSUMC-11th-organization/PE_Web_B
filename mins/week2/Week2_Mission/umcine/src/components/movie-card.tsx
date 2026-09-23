import type { Movie } from "../types/movie";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark: (movieId: number) => void;
}

export default function MovieCard({ movie, onToggleBookmark }: MovieCardProps) {
  return (
    <article className="movie-card">
      <div className="poster">
        <img src={movie.posterPath} alt={`${movie.title} 포스터`} />
        <button
          className={`bookmark-button${movie.isBookmarked ? " active" : ""}`}
          type="button"
          aria-label={`${movie.title} 북마크 ${movie.isBookmarked ? "해제" : "추가"}`}
          aria-pressed={movie.isBookmarked}
          onClick={() => onToggleBookmark(movie.id)}
        >
          <img
            src={movie.isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"}
            alt=""
          />
        </button>
      </div>

      <h2>{movie.title}</h2>
      <p>{movie.releaseDate}</p>
    </article>
  );
}
