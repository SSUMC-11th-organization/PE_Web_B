import { useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { getMovies } from "../../api/movies/get-movies";
import { ErrorMessage } from "../../components/error-message";
import { MovieGrid } from "../../components/movies/movie-grid";
import { Pagination } from "../../components/movies/pagination";
import { TmdbFooter } from "../../components/layout/tmdb-footer";
import { useViewSettingsStore } from "../../stores/view-settings-store";
import type { MovieCardItem } from "../../types/movie-card";
import { cn } from "../../utils/cn";
import { toMovieCardItem } from "../../utils/movies/movie-adapter";

const TMDB_MAX_PAGE = 500;

export function MovieListPage() {
  const { page = 1 } = useSearch({ from: "/" });
  const navigate = useNavigate({ from: "/" });

  const cardSize = useViewSettingsStore((state) => state.cardSize);
  const setCardSize = useViewSettingsStore((state) => state.setCardSize);

  const [movies, setMovies] = useState<MovieCardItem[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let ignore = false;

    async function loadMovies() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await getMovies({ page });
        if (!ignore) {
          setMovies(response.results.map(toMovieCardItem));
          setTotalPages(Math.min(response.total_pages, TMDB_MAX_PAGE));
        }
      } catch {
        if (!ignore) setErrorMessage("영화 목록을 불러오지 못했어요.");
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    loadMovies();

    return () => {
      ignore = true;
    };
  }, [page, retryKey]);

  function handlePageChange(nextPage: number) {
    navigate({ search: nextPage === 1 ? {} : { page: nextPage } });
  }

  let content: ReactNode;
  if (isLoading) {
    content = <p className="text-gray-500">영화 목록을 불러오는 중이에요.</p>;
  } else if (errorMessage) {
    content = (
      <ErrorMessage
        message={errorMessage}
        onRetry={() => setRetryKey((key) => key + 1)}
      />
    );
  } else if (movies.length === 0) {
    content = <p className="text-gray-500">조건에 맞는 영화가 없어요.</p>;
  } else {
    content = <MovieGrid movies={movies} />;
  }

  return (
    <>
      <p className="m-0 px-4 py-2.5 bg-gray-900 text-white text-center text-sm font-bold tracking-[0.02em]">
        웹B 노형원
      </p>
      <div className="min-h-screen px-8 pt-6 pb-12">
        <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-[0_8px_32px_rgba(15,23,42,0.06)] overflow-hidden">
          <section className="px-12 pt-2 pb-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="m-0 text-[32px] font-bold tracking-[-0.04em]">
                영화 목록
              </h1>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setCardSize("small")}
                  aria-pressed={cardSize === "small"}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-sm font-semibold",
                    cardSize === "small"
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-500",
                  )}
                >
                  작게
                </button>
                <button
                  type="button"
                  onClick={() => setCardSize("large")}
                  aria-pressed={cardSize === "large"}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-sm font-semibold",
                    cardSize === "large"
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-500",
                  )}
                >
                  크게
                </button>
              </div>
            </div>
            {content}
          </section>
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
          <TmdbFooter />
        </div>
      </div>
    </>
  );
}