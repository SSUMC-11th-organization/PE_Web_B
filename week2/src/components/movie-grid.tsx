import type { Movie } from "../types/movie";
import MovieCard from "./movie-card";
import "./movie-grid.css";

interface MovieGridProps {
  movies: Movie[];
}

function MovieGrid({ movies }: MovieGridProps) {
  return (
    <ul className="movie-grid">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </ul>
  );
}

export default MovieGrid;
