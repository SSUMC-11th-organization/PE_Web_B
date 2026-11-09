import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import type { SubmitEvent } from "react";
import { searchMovies } from "../../api/movies/search-movies";
import { BookmarkButton } from "../../components/movies/bookmark-button";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";

const submitButtonClassName =
    "h-[42px] shrink-0 cursor-pointer rounded-lg bg-ink px-4 text-sm font-extrabold whitespace-nowrap text-white transition-colors hover:bg-ink/85";

export function SearchPage() {
    const { query } = useSearch({ from: "/search" });
    const navigate = useNavigate({ from: "/search" });
    const normalizedQuery = query?.trim() ?? "";

    const searchQuery = useQuery({
        queryKey: ["movies", "search", { query: normalizedQuery }],
        queryFn: () => searchMovies({ query: normalizedQuery }),
        enabled: normalizedQuery.length > 0,
    });

    const searchResults = searchQuery.data?.results ?? [];

    function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const nextQuery = String(formData.get("query") ?? "").trim();
        navigate({
            search: nextQuery ? { query: nextQuery } : {},
        });
    }

    if (!normalizedQuery) {
        return (
            <main className="flex flex-1 flex-col items-center px-4 py-24 sm:px-[72px] sm:pt-[209px]">
                <div className="flex w-full max-w-[790px] flex-col items-center gap-9">
                    <h1 className="text-center text-[32px] leading-[1.14] font-bold tracking-[-1.6px] sm:text-[46px] sm:tracking-[-2.3px]">
                        어떤 영화를 찾고 있나요?
                    </h1>
                    <form
                        onSubmit={handleSubmit}
                        className="flex h-[74px] w-full items-center gap-3.5 rounded-xl border-2 border-ink bg-surface pr-[17px] pl-[21px] drop-shadow-[0_12px_17px_rgba(17,19,24,0.08)]"
                    >
                        <img className="size-6 shrink-0" src="/icons/search.svg" alt="" />
                        <input
                            name="query"
                            type="search"
                            aria-label="영화 제목"
                            placeholder="예: 스파이더맨"
                            className="min-w-0 flex-1 text-[17px] outline-none placeholder:text-ink-tertiary"
                        />
                        <button type="submit" className={submitButtonClassName}>
                            검색
                        </button>
                    </form>
                    <p className="text-sm text-ink-tertiary">검색어를 입력해 주세요.</p>
                </div>
            </main>
        );
    }

    return (
        <main className="flex flex-1 flex-col px-4 py-6 sm:px-10 lg:px-20">
            <div className="flex flex-col gap-[17px]">
                <h1 className="text-[38px] leading-[44px] font-bold tracking-[-1.71px]">영화 검색</h1>
                <form
                    onSubmit={handleSubmit}
                    className="flex h-[54px] items-center gap-[18px] rounded-[9px] border border-line bg-surface pr-2.5 pl-[15px]"
                >
                    <img className="size-6 shrink-0" src="/icons/search.svg" alt="" />
                    {/* URL의 query가 바뀌면 key가 바뀌어 입력창이 새 검색어로 초기화돼요 */}
                    <input
                        key={query}
                        name="query"
                        type="search"
                        aria-label="검색어"
                        defaultValue={query}
                        className="min-w-0 flex-1 text-sm font-bold outline-none [&::-webkit-search-cancel-button]:hidden"
                    />
                    <Link to="/search" className="shrink-0" aria-label="검색어 지우기">
                        <img className="size-6" src="/icons/close.svg" alt="" />
                    </Link>
                    <button type="submit" className={submitButtonClassName}>
                        다시 검색
                    </button>
                </form>
            </div>

            <div className="flex h-[54px] items-center justify-between gap-4 border-b border-line">
                <h2 className="truncate text-lg font-bold">‘{query}’ 검색 결과</h2>
                <p className="shrink-0 text-xs text-ink-tertiary">영화 {searchResults.length}편</p>
            </div>

            {searchQuery.isLoading ? (
                <p className="py-20 text-center text-sm text-ink-tertiary">검색 중이에요.</p>
            ) : searchQuery.isError ? (
                <p className="py-20 text-center text-sm text-ink-tertiary">검색 결과를 불러오지 못했어요.</p>
            ) : searchQuery.isSuccess && searchResults.length === 0 ? (
                <p className="py-20 text-center text-sm text-ink-tertiary">
                    ‘{query}’와 일치하는 영화가 없어요.
                </p>
            ) : (
                <ul className="grid grid-cols-1 gap-x-10 lg:grid-cols-2">
                    {searchResults.map((movie) => (
                        <li key={movie.id} className="min-w-0">
                            <article className="flex gap-[18px] border-b border-line py-5">
                                <Link
                                    to="/movies/$movieId"
                                    params={{ movieId: String(movie.id) }}
                                    className="shrink-0"
                                >
                                    <img
                                        className="h-[190px] w-[126px] rounded-[10px] bg-page object-cover"
                                        src={getTmdbPosterUrl(movie.poster_path) ?? undefined}
                                        alt={`${movie.title} 포스터`}
                                    />
                                </Link>
                                <div className="flex min-w-0 flex-1 flex-col items-start gap-2 pt-1">
                                    <h3 className="text-lg leading-[24.3px] font-bold">{movie.title}</h3>
                                    <p className="flex flex-wrap gap-x-2 text-xs text-ink-tertiary">
                                        <span>{movie.original_title}</span>
                                        <span>{movie.release_date}</span>
                                    </p>
                                    <p className="line-clamp-3 min-h-[66px] text-[12.5px] leading-[20.25px] text-ink-secondary">
                                        {movie.overview}
                                    </p>
                                    <Link
                                        to="/movies/$movieId"
                                        params={{ movieId: String(movie.id) }}
                                        className="flex items-center gap-1 text-xs font-extrabold text-action hover:underline"
                                    >
                                        상세 보기
                                        <span
                                            className="size-4 bg-action [mask:url(/icons/arrow-right.svg)_center/contain_no-repeat]"
                                            aria-hidden="true"
                                        />
                                    </Link>
                                </div>
                                <BookmarkButton movieId={movie.id} movieTitle={movie.title} />
                            </article>
                        </li>
                    ))}
                </ul>
            )}
        </main>
    );
}
