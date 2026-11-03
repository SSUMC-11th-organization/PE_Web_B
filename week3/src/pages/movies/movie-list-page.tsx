import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/pagination";
import LoadingState from "../../components/status/loading-state";
import ErrorState from "../../components/status/error-state";
import EmptyState from "../../components/status/empty-state";
import { getPopularMovies } from "../../apis/movies";

function MovieListPage() {
  const [page, setPage] = useState(1);

  const moviesQuery = useQuery({
    queryKey: ["movies", "list", { page }],
    queryFn: ({ signal }) => getPopularMovies(page, signal),
    // 다음 페이지를 불러오는 동안 이전 페이지 목록을 그대로 보여줘요.
    placeholderData: keepPreviousData,
  });

  const movies = moviesQuery.data?.movies ?? [];
  const totalPages = moviesQuery.data?.totalPages ?? 0;

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
    window.scrollTo({ top: 0 });
  };

  return (
    <main className="mx-auto w-full max-w-[1440px] flex-1 px-20 py-10">
      <h1 className="mb-7 text-2xl font-bold">영화 목록</h1>
      {moviesQuery.isPending ? (
        <LoadingState />
      ) : moviesQuery.isError ? (
        <ErrorState
          error={moviesQuery.error}
          onRetry={() => moviesQuery.refetch()}
        />
      ) : movies.length === 0 ? (
        <EmptyState message="표시할 영화가 없어요." />
      ) : (
        <>
          <MovieGrid movies={movies} />
          <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
        </>
      )}
    </main>
  );
}

export default MovieListPage;
