import { useQuery } from '@tanstack/react-query'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { movieQueries } from '../../api/movies/queries'
import StatusMessage from '../../components/common/status-message'
import MovieGrid, { MovieGridSkeleton } from '../../components/movies/movie-grid'
import Pagination from '../../components/pagination'
import { TMDB_MAX_PAGE } from '../../utils/movies/parse-page'
import { toMovieCardItem } from '../../utils/movies/to-movie-card-item'

export function MovieListPage() {
  const { page = 1 } = useSearch({ from: '/' })
  const navigate = useNavigate({ from: '/' })

  // page가 query key에 들어 있어서 페이지마다 캐시가 따로 저장돼요.
  const moviesQuery = useQuery(movieQueries.list(page))

  const movies = moviesQuery.data?.results ?? []
  const totalPages = Math.min(moviesQuery.data?.total_pages ?? 1, TMDB_MAX_PAGE)

  function handlePageChange(nextPage: number) {
    navigate({ search: { page: nextPage } })
    window.scrollTo({ top: 0 })
  }

  function renderContent() {
    if (moviesQuery.isPending) return <MovieGridSkeleton />
    if (moviesQuery.isError) {
      return <StatusMessage message="영화 목록을 불러오지 못했어요." onRetry={() => moviesQuery.refetch()} />
    }
    if (movies.length === 0) return <StatusMessage message="조건에 맞는 영화가 없어요." />
    return <MovieGrid movies={movies.map(toMovieCardItem)} />
  }

  return (
    <main className="mx-auto max-w-[1440px] px-4 pt-6 pb-16 md:px-20">
      <h1 className="mb-5 text-[38px] leading-[44px] font-bold tracking-[-1.71px] text-text-primary">
        영화 목록
      </h1>
      {renderContent()}
      {!moviesQuery.isError && (
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
      )}
    </main>
  )
}
