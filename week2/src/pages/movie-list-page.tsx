import MovieGrid from "../components/movie-grid";
import { movies } from "../data/movies";
import "./movie-list-page.css";

function MovieListPage() {
  return (
    <main className="movie-list-page">
      <h1 className="movie-list-page__title">영화 목록</h1>
      <MovieGrid movies={movies} />
    </main>
  );
}

export default MovieListPage;
