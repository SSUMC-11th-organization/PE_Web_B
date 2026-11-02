import type { MovieCardItem } from "../../types/movie-card";
import { useViewSettingsStore, type CardSize } from "../../stores/view-settings-store";
import { MovieCard } from "./movie-card";

interface MovieGridProps {
  movies: MovieCardItem[];
}

const GRID_CLASS: Record<CardSize, string> = {
  small: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5",
  large: "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3",
};

export function MovieGrid({ movies }: MovieGridProps) {
  const cardSize = useViewSettingsStore((state) => state.cardSize);

  return (
    <section className={`grid gap-y-6 gap-x-4 ${GRID_CLASS[cardSize]}`}>
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </section>
  );
}