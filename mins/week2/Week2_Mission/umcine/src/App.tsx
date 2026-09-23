import { useState } from "react";
import "./App.css";
import Header from "./components/header";
import MovieGrid from "./components/movie-grid";
import { movies } from "./data/movies";
import type { Movie } from "./types/movie";

export default function App() {
  const [movieList, setMovieList] = useState<Movie[]>(movies);

  function handleToggleBookmark(movieId: number) {
    setMovieList((currentMovies) =>
      currentMovies.map((movie) =>
        movie.id === movieId
          ? { ...movie, isBookmarked: !movie.isBookmarked }
          : movie,
      ),
    );
  }

  return (
    <div className="app">
      <Header />

      <main className="movie-page">
        <h1>영화 목록</h1>
        <MovieGrid movies={movieList} onToggleBookmark={handleToggleBookmark} />
      </main>

      <footer className="site-footer">
        <img src="/images/logos/tmdb-logo.svg" alt="TMDB" />
        <p>
          This product uses the TMDB API but is not endorsed or certified by{" "}
          <a href="https://www.themoviedb.org/?language=ko">TMDB</a>.
        </p>
      </footer>
    </div>
  );
}
