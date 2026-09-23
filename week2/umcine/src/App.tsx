import { useState } from 'react'
import Header from './components/header'
import MovieGrid from './components/movie-grid'
import Pagination from './components/pagination'
import { movies as initialMovies } from './data/movies'
import type { Movie } from './types/movie'
import './App.css'

function App() {
  const [movies, setMovies] = useState<Movie[]>(initialMovies)
  const [currentPage, setCurrentPage] = useState(1)

  const handleToggleBookmark = (id: number) => {
    setMovies((prev) =>
      prev.map((movie) => (movie.id === id ? { ...movie, isBookmarked: !movie.isBookmarked } : movie)),
    )
  }

  return (
    <div className="movie-list-page">
      <Header />
      <main className="movie-list-page__content">
        <h1 className="movie-list-page__title">영화 목록</h1>
        <MovieGrid movies={movies} onToggleBookmark={handleToggleBookmark} />
        <Pagination currentPage={currentPage} totalPages={5} onPageChange={setCurrentPage} />
      </main>
    </div>
  )
}

export default App
