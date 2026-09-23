import type { Movie } from "../types/movie";
import "./movie-card.css";

interface MovieCardProps {
  movie: Movie;
}

function MovieCard({ movie }: MovieCardProps) {
  return (
    <li className="movie-card">
      <div className="movie-card__poster-wrap">
        <img
          className="movie-card__poster"
          src={movie.posterPath}
          alt={movie.title}
          loading="lazy"
        />
        <span
          className={
            movie.isBookmarked
              ? "movie-card__bookmark movie-card__bookmark--active"
              : "movie-card__bookmark"
          }
        >
          <span
            className="movie-card__bookmark-icon"
            style={{
              maskImage: movie.isBookmarked
                ? "url(/icons/movie-icons/bookmark.svg)"
                : "url(/icons/movie-icons/bookmark-outline.svg)",
              WebkitMaskImage: movie.isBookmarked
                ? "url(/icons/movie-icons/bookmark.svg)"
                : "url(/icons/movie-icons/bookmark-outline.svg)",
            }}
          />
        </span>
      </div>

      <div className="movie-card__info">
        <p className="movie-card__title">{movie.title}</p>
        <p className="movie-card__date">{movie.releaseDate}</p>
      </div>
    </li>
  );
}

export default MovieCard;
