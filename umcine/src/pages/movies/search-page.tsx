import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, type SubmitEvent } from "react";
import { movieQueries } from "../../api/movies/queries";
import StatusMessage from "../../components/common/status-message";
import BookmarkButton from "../../components/movies/bookmark-button";
import MoviePoster from "../../components/movies/movie-poster";
import Pagination from "../../components/pagination";
import { TMDB_MAX_PAGE } from "../../utils/movies/parse-page";
import { toMovieCardItem } from "../../utils/movies/to-movie-card-item";

export function SearchPage() {
  const { query = "", page = 1 } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });
  const [searchText, setSearchText] = useState(query);
  const [prevQuery, setPrevQuery] = useState(query);

  // 뒤로/앞으로 가기로 URL의 query가 바뀌면 입력창도 맞춰요.
  if (query !== prevQuery) {
    setPrevQuery(query);
    setSearchText(query);
  }

  const normalizedQuery = query.trim();

  // 검색어와 페이지가 query key에 들어 있어서 검색어·페이지마다 캐시가 따로 저장돼요.
  const searchQuery = useQuery(movieQueries.search(normalizedQuery, page));

  const movies = searchQuery.data?.results ?? [];
  const totalResults = searchQuery.data?.total_results ?? 0;
  const totalPages = Math.min(searchQuery.data?.total_pages ?? 1, TMDB_MAX_PAGE);

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextQuery = searchText.trim();
    // 새 검색어로 검색하면 1페이지부터 다시 보여 줘요.
    navigate({
      search: nextQuery ? { query: nextQuery } : {},
    });
  }

  function handlePageChange(nextPage: number) {
    navigate({ search: (prev) => ({ ...prev, page: nextPage }) });
    window.scrollTo({ top: 0 });
  }

  function renderResults() {
    // enabled로 요청을 막을 수 있는 화면이라 실제 첫 요청 중일 때만(isLoading) 로딩을 보여 줘요.
    if (searchQuery.isLoading) return <StatusMessage message="검색 결과를 불러오는 중이에요." />;
    if (searchQuery.isError) {
      return (
        <StatusMessage message="검색 결과를 불러오지 못했어요." onRetry={() => searchQuery.refetch()} />
      );
    }
    if (movies.length === 0) return <StatusMessage message="조건에 맞는 영화가 없어요." />;

    return (
      <>
        <ul className="flex flex-col gap-4">
          {movies.map(toMovieCardItem).map((movie) => (
            <li
              key={movie.id}
              className="flex gap-5 rounded-[10px] border border-border-default bg-bg-surface p-4"
            >
              <MoviePoster
                className="h-[174px] w-[120px] shrink-0 rounded-lg"
                src={movie.posterUrl}
                alt={`${movie.title} 포스터`}
              />
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-extrabold text-text-primary">{movie.title}</h3>
                  <BookmarkButton movieId={movie.id} />
                </div>
                <p className="text-sm text-text-secondary">{movie.originalTitle}</p>
                <p className="text-xs text-text-tertiary">{movie.releaseDate}</p>
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-text-secondary">
                  {movie.overview}
                </p>
                <Link
                  className="mt-auto self-start text-sm font-bold text-action-primary hover:underline"
                  to="/movies/$movieId"
                  params={{ movieId: String(movie.id) }}
                >
                  상세 보기
                </Link>
              </div>
            </li>
          ))}
        </ul>
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
      </>
    );
  }

  return (
    <main className="mx-auto max-w-[1440px] px-4 pt-6 pb-16 md:px-20">
      <h1 className="mb-5 text-[38px] leading-[44px] font-bold tracking-[-1.71px] text-text-primary">
        영화 검색
      </h1>
      <form className="flex gap-2" onSubmit={handleSubmit}>
        <div className="flex h-12 flex-1 items-center gap-2 rounded-[10px] border border-border-default bg-bg-surface px-4 focus-within:border-action-primary">
          <img className="size-5 opacity-50" src="/icons/search.svg" alt="" />
          <input
            className="h-full flex-1 bg-transparent text-sm text-text-primary outline-none placeholder:text-text-tertiary"
            aria-label="검색어"
            placeholder="영화 제목이나 원제를 입력해 주세요"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
          />
        </div>
        <button
          className="h-12 cursor-pointer rounded-[10px] bg-action-primary px-6 text-sm font-bold text-white"
          type="submit"
        >
          검색
        </button>
      </form>

      {!normalizedQuery ? (
        <StatusMessage className="mt-10" message="검색어를 입력해 주세요." />
      ) : (
        <section className="mt-10">
          <div className="mb-5 flex items-baseline gap-3">
            <h2 className="text-2xl font-bold tracking-[-0.8px] text-text-primary">
              ‘{normalizedQuery}’ 검색 결과
            </h2>
            {searchQuery.isSuccess && (
              <p className="text-sm text-text-tertiary">영화 {totalResults.toLocaleString()}편</p>
            )}
          </div>
          {renderResults()}
        </section>
      )}
    </main>
  );
}
