import { useState, type FormEvent } from "react";
import { getRouteApi, Link, useNavigate } from "@tanstack/react-router";
import { cn } from "../../utils/cn";
import { useQuery } from "@tanstack/react-query";
import { searchMovies } from "../../apis/movies";
import MoviePoster from "../../components/movies/movie-poster";
import LoadingState from "../../components/status/loading-state";
import ErrorState from "../../components/status/error-state";
import EmptyState from "../../components/status/empty-state";

const route = getRouteApi("/search");

function SearchPage() {
  const { query } = route.useSearch();
  const navigate = useNavigate();
  const keyword = query?.trim() ?? "";
  const hasQuery = keyword !== "";
  const [prevKeyword, setPrevKeyword] = useState(keyword);
  const [input, setInput] = useState(keyword);

  if (prevKeyword !== keyword) {
    setPrevKeyword(keyword);
    setInput(keyword);
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    navigate({ to: "/search", search: { query: input.trim() || undefined } });
  };

  const handleClear = () => {
    setInput("");
    navigate({ to: "/search" });
  };

  return (
    <main
      className={cn(
        "mx-auto flex w-full max-w-[1440px] flex-1 flex-col px-20",
        hasQuery ? "items-stretch pb-16 pt-6" : "items-center px-[72px] pb-[120px] pt-[120px]",
      )}
    >
      <div
        className={cn(
          "flex flex-col gap-4",
          hasQuery ? "w-full" : "w-[790px] max-w-full items-center gap-9",
        )}
      >
        <h1
          className={cn(
            "font-bold tracking-[-2.3px]",
            hasQuery ? "text-[46px] leading-[52px]" : "text-[46px]",
          )}
        >
          {hasQuery ? "영화 검색" : "어떤 영화를 찾고 있나요?"}
        </h1>

        <form
          onSubmit={handleSubmit}
          className={cn(
            "flex w-full items-center gap-3.5 bg-surface",
            hasQuery
              ? "h-[54px] rounded-lg border border-line pl-[17px] pr-[12px] shadow-sm"
              : "h-[74px] rounded-xl border-2 border-ink pl-[21px] pr-[17px] shadow-[0_12px_17px_rgba(17,19,24,0.08)]",
          )}
        >
          <img src="/icons/movie-icons/search.svg" alt="" className="size-6" />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="예: 스파이더맨"
            aria-label="영화 제목"
            className={cn(
              "min-w-0 flex-1 bg-transparent px-0.5 outline-none placeholder:text-ink-3",
              hasQuery ? "text-sm font-medium" : "text-[17px]",
            )}
          />
          {hasQuery && (
            <button
              type="button"
              aria-label="검색어 지우기"
              onClick={handleClear}
              className="flex size-6 items-center justify-center"
            >
              <img src="/icons/movie-icons/close.svg" alt="" className="size-6" />
            </button>
          )}
          <button
            type="submit"
            className="h-[42px] rounded-lg bg-ink px-4 text-sm font-extrabold text-white"
          >
            {hasQuery ? "다시 검색" : "검색"}
          </button>
        </form>
      </div>

      {!hasQuery && (
        <p className="mt-10 text-center text-sm text-ink-2">검색어를 입력해 주세요.</p>
      )}

      {hasQuery && <SearchResults keyword={keyword} />}
    </main>
  );
}

function SearchResults({ keyword }: { keyword: string }) {
  const searchQuery = useQuery({
    queryKey: ["movies", "search", { query: keyword }],
    queryFn: ({ signal }) => searchMovies(keyword, signal),
    enabled: keyword.length > 0,
  });

  const searchResults = searchQuery.data?.movies ?? [];

  return (
    <section className="mt-5">
      <div className="flex items-baseline justify-between border-b border-line pb-3">
        <h2 className="text-lg font-bold">&lsquo;{keyword}&rsquo; 검색 결과</h2>
        {searchQuery.isSuccess && (
          <p className="text-xs text-ink-3">
            영화 {searchQuery.data.totalResults}편 · {searchQuery.data.page}페이지
          </p>
        )}
      </div>

      {searchQuery.isLoading ? (
        <LoadingState message="영화를 검색하는 중이에요." />
      ) : searchQuery.isError ? (
        <ErrorState error={searchQuery.error} onRetry={() => searchQuery.refetch()} />
      ) : searchQuery.isSuccess && searchResults.length === 0 ? (
        <EmptyState message={`‘${keyword}’에 대한 검색 결과가 없어요.`} />
      ) : (
        <ul className="grid grid-cols-2 gap-x-10">
          {searchResults.map((movie) => (
            <li key={movie.id} className="border-b border-line py-5">
              <Link
                to="/movies/$movieId"
                params={{ movieId: String(movie.id) }}
                className="flex gap-[18px]"
              >
                <MoviePoster
                  src={movie.posterUrl}
                  alt={movie.title}
                  loading="lazy"
                  className="h-[190px] w-[126px] shrink-0 rounded-lg"
                />
                <div className="flex min-w-0 flex-1 flex-col gap-2.5 pt-1">
                  <h3 className="text-xl font-bold leading-6">{movie.title}</h3>
                  <p className="text-xs text-ink-3">
                    {movie.originalTitle}
                    <span className="ml-2">{movie.releaseDate}</span>
                  </p>
                  <p className="line-clamp-2 text-xs leading-5 text-ink-2">{movie.overview}</p>
                  <span className="mt-auto mb-9 flex items-center gap-1 text-xs font-bold text-primary">
                    상세 보기
                    <span
                      className="size-3.5 bg-primary [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain]"
                      style={{
                        maskImage: "url(/icons/movie-icons/arrow-right.svg)",
                        WebkitMaskImage: "url(/icons/movie-icons/arrow-right.svg)",
                      }}
                    />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default SearchPage;
