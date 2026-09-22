import { useState } from "react";
import { movies as initialMovies } from "./data/movies";
import { Header } from "./components/header";
import { MovieGrid } from "./components/movie-grid";
import { Pagination } from "./components/pagination";
import "./App.css";

export default function App() {
  const [movies, setMovies] = useState(initialMovies);

  function handleToggleBookmark(movieId: number) {
    setMovies((currentMovies) =>
      currentMovies.map((movie) =>
        movie.id === movieId
          ? { ...movie, isBookmarked: !movie.isBookmarked }
          : movie,
      ),
    );
  }

  return (
    <>
      <p className="credit-bar">웹B 노형원</p>
      <div className="page">
        <div className="page-shell">
          <Header />
          <section className="movie-list">
            <h1>영화 목록</h1>
            <MovieGrid
              movies={movies}
              onToggleBookmark={handleToggleBookmark}
            />
          </section>
          <Pagination />
          <footer className="site-footer">
            <img src="/images/logos/tmdb-logo.svg" alt="TMDB" />
          </footer>
        </div>
      </div>
    </>
  );
}
