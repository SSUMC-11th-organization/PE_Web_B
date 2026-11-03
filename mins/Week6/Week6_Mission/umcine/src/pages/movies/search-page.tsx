import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState, type SubmitEvent } from "react";
import { Footer } from "../../components/layout/footer";
import { BookmarkButton } from "../../components/bookmark-button";
import { useQuery } from "@tanstack/react-query";
import { movieQueries } from "../../api/movies/movie-queries";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";
import { MovieImage } from "../../components/movies/movie-image";
import { cn } from "../../utils/cn";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });
  const [draft, setDraft] = useState({ query: query ?? "", text: query ?? "" });
  const searchText = draft.query === (query ?? "") ? draft.text : (query ?? "");

  const normalizedQuery = query?.trim() ?? "";
  const { data, isError, isLoading, refetch } = useQuery(movieQueries.search(normalizedQuery));
  const searchResults = data?.results ?? [];

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextQuery = searchText.trim();
    navigate({ search: nextQuery ? { query: nextQuery } : {} });
  }

  const hasQuery = Boolean(normalizedQuery);
  const searchForm = (
    <form
      className={cn(
        "flex w-full items-center bg-white",
        hasQuery
          ? "h-[54px] gap-[18px] rounded-[9px] border border-[#e3e6eb] pl-[15px] pr-[10px]"
          : "h-[74px] gap-[14px] rounded-xl border-2 border-[#17191e] pl-[21px] pr-[17px] shadow-[0_12px_17px_rgba(17,19,24,0.08)]",
      )}
      onSubmit={handleSubmit}
      role="search"
    >
      <img className="h-6 w-6 shrink-0" src="/icons/search.svg" alt="" />
      <input
        className={cn("min-w-0 flex-1 border-0 bg-transparent px-0 text-[#17191e] outline-none", hasQuery ? "text-sm font-bold" : "text-[17px]")}
        aria-label="검색어"
        placeholder="예: 스파이더맨"
        value={searchText}
        onChange={(event) => setDraft({ query: query ?? "", text: event.target.value })}
      />
      {hasQuery && searchText && (
        <button className="flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center" type="button" aria-label="검색어 지우기" onClick={() => setDraft({ query: query ?? "", text: "" })}>
          <img className="h-6 w-6" src="/icons/close.svg" alt="" />
        </button>
      )}
      <button className="h-[42px] shrink-0 cursor-pointer rounded-lg bg-[#17191e] px-4 text-sm font-extrabold text-white" type="submit">
        {hasQuery ? "다시 검색" : "검색"}
      </button>
    </form>
  );

  return (
    <div className="flex min-h-[calc(100vh-91px)] flex-col bg-[#f6f7f9]">
      <main className={cn("flex-1", hasQuery ? "px-5 py-6 sm:px-10 lg:px-20" : "flex items-center justify-center px-5 py-16 sm:px-10")}>
        {!hasQuery ? (
          <section className="w-full max-w-[790px] text-center">
            <h1 className="mb-9 text-3xl leading-tight font-bold tracking-[-2.3px] text-[#17191e] sm:text-[46px] sm:leading-[52px]">어떤 영화를 찾고 있나요?</h1>
            {searchForm}
            <p className="mt-4 text-sm text-[#606774]">검색어를 입력해 주세요.</p>
          </section>
        ) : (
          <div className="mx-auto max-w-[1280px]">
            <h1 className="mb-[17px] text-[38px] leading-[44px] font-bold tracking-[-1.71px] text-[#17191e]">영화 검색</h1>
            {searchForm}
            <section aria-live="polite">
              <div className="mt-4 flex min-h-[54px] flex-wrap items-center justify-between gap-2 border-y border-[#e3e6eb]">
                <h2 className="text-lg font-bold text-[#17191e]">‘{query?.trim()}’ 검색 결과</h2>
                <p className="text-xs text-[#969da8]">영화 {data?.total_results ?? 0}편</p>
              </div>
              {isLoading ? <p className="py-8" role="status">검색 결과를 불러오는 중이에요.</p> : isError ? <div className="py-8" role="alert"><p>검색 결과를 불러오지 못했어요.</p><button type="button" onClick={() => void refetch()}>다시 시도</button></div> : searchResults.length === 0 ? (
                <p className="py-8 text-[#606774]">검색 결과가 없어요.</p>
              ) : (
                <ul className="grid gap-x-10 md:grid-cols-2">
                  {searchResults.map((movie) => (
                    <li key={movie.id} className="min-w-0 border-b border-[#e3e6eb] py-5">
                      <article className="flex min-w-0 gap-[18px]">
                        <Link className="block h-[190px] w-[126px] shrink-0 overflow-hidden rounded-[10px]" to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
                          <MovieImage className="h-full w-full object-cover" src={getTmdbPosterUrl(movie.poster_path)} alt={`${movie.title} 포스터`} />
                        </Link>
                        <div className="flex min-w-0 flex-1 flex-col gap-2">
                          <Link className="text-lg leading-[24px] font-bold text-[#17191e] no-underline hover:underline" to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
                            <h3>{movie.title}</h3>
                          </Link>
                          <p className="flex flex-wrap gap-x-2 text-xs text-[#969da8]"><span>{movie.original_title}</span><span>{movie.release_date}</span></p>
                          <p className="line-clamp-3 text-[12.5px] leading-[20px] text-[#606774]">{movie.overview}</p>
                          <BookmarkButton movieId={movie.id} />
                          <Link className="mt-auto inline-flex items-center gap-1 self-start text-xs font-extrabold text-[#2563eb] no-underline" to="/movies/$movieId" params={{ movieId: String(movie.id) }}>
                            상세 보기 <img className="h-4 w-4" src="/icons/arrow-right.svg" alt="" />
                          </Link>
                        </div>
                      </article>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
