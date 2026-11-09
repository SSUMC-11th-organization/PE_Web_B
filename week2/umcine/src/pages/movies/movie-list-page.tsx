import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMovies } from "../../api/movies/get-movies";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";

// TMDB 인기 영화는 수백 페이지라서 버튼은 앞쪽 5페이지까지만 보여 줘요
const MAX_VISIBLE_PAGES = 5;

export function MovieListPage() {
  const [page, setPage] = useState(1);

  const moviesQuery = useQuery({
    queryKey: ["movies", "list", { page }],
    queryFn: () => getMovies({ page }),
  });

  const movies = moviesQuery.data?.results ?? [];
  // 로딩 중이나 오류일 때도 페이지 버튼이 사라지지 않게 기본값을 둬요
  const totalPages = Math.min(moviesQuery.data?.total_pages ?? MAX_VISIBLE_PAGES, MAX_VISIBLE_PAGES);

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
  };

  return (
    <main className="flex flex-1 flex-col gap-5 px-4 py-6 sm:px-10 lg:px-20">
      <h1 className="text-[38px] leading-[44px] font-bold tracking-[-1.71px] text-ink">
        영화 목록
      </h1>
      {moviesQuery.isPending ? (
        <p className="py-20 text-center text-sm text-ink-tertiary">영화 목록을 불러오는 중이에요.</p>
      ) : moviesQuery.isError ? (
        <p className="py-20 text-center text-sm text-ink-tertiary">영화 목록을 불러오지 못했어요.</p>
      ) : movies.length === 0 ? (
        <p className="py-20 text-center text-sm text-ink-tertiary">표시할 영화가 없어요.</p>
      ) : (
        <MovieGrid movies={movies} />
      )}
      {totalPages > 0 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </main>
  );
}
