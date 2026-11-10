import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { movieQueries } from "../../api/movies/movie-queries";
import { Footer } from "../../components/layout/footer";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import { useBookmarkStore } from "../../stores/bookmark-store";
import { toMovieCard } from "../../utils/movies/movie-adapter";
export function MovieListPage() {
  const ids = useBookmarkStore((state) => state.bookmarkedMovieIds);
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);
  const [page, setPage] = useState(1);
  const { data, isError, isPending, refetch } = useQuery(movieQueries.list(page));
  return (
    <div className="flex min-h-[calc(100vh-91px)] flex-col bg-[#f6f7f9]">
      <main className="w-full flex-1 px-5 pb-12 pt-6 sm:px-10 lg:px-20">
        <h1 className="mb-5 text-[38px] font-bold">영화 목록</h1>
        {isPending ? (
          <p role="status">영화 목록을 불러오는 중이에요.</p>
        ) : isError ? (
          <div role="alert">
            <p>영화 목록을 불러오지 못했어요.</p>
            <button type="button" onClick={() => void refetch()}>
              다시 시도
            </button>
          </div>
        ) : !data?.results.length ? (
          <p>조건에 맞는 영화가 없어요.</p>
        ) : (
          <>
            <MovieGrid
              movies={data.results.map((movie) => toMovieCard(movie, ids.includes(movie.id)))}
              onToggleBookmark={toggleBookmark}
            />
            <Pagination
              page={page}
              totalPages={Math.min(data.total_pages, 500)}
              onPageChange={setPage}
            />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
