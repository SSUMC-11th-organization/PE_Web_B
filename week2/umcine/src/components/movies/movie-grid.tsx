import type { TmdbMovie } from "../../api/movies/models";
import MovieCard from "./movie-card";

interface MovieGridProps {
  movies: TmdbMovie[];
}

export default function MovieGrid({ movies }: MovieGridProps) {
  return (
    <ul className="grid grid-cols-2 gap-x-[18px] gap-y-5 sm:grid-cols-3 lg:grid-cols-5">
      {movies.map((movie) => (
        <li key={movie.id} className="min-w-0">
          <MovieCard movie={movie} />
        </li>
      ))}
    </ul>
  );
}
