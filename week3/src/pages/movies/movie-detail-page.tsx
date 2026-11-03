import { useState } from "react";
import { getRouteApi, Link } from "@tanstack/react-router";
import { isHTTPError } from "ky";
import { useQuery } from "@tanstack/react-query";
import { getMovieDetail } from "../../apis/movies";
import { useBookmarkStore } from "../../stores/bookmark-store";
import { cn } from "../../utils/cn";
import MoviePoster from "../../components/movies/movie-poster";
import LoadingState from "../../components/status/loading-state";
import ErrorState from "../../components/status/error-state";
import type { MovieDetail as MovieDetailData } from "../../types/movie";

const route = getRouteApi("/movies/$movieId");

const STARS = [1, 2, 3, 4, 5];

const isNotFoundError = (error: unknown) =>
  isHTTPError(error) && error.response.status === 404;

function MovieDetailPage() {
  const { movieId: movieIdParam } = route.useParams();
  const movieId = Number(movieIdParam);
  const isValidMovieId = Number.isInteger(movieId) && movieId > 0;

  const movieDetailQuery = useQuery({
    queryKey: ["movies", "detail", movieId],
    queryFn: ({ signal }) => getMovieDetail(movieId, signal),
    enabled: isValidMovieId,
    // 없는 영화(404)는 다시 요청해도 결과가 같아서 재시도하지 않아요.
    retry: (failureCount, error) => !isNotFoundError(error) && failureCount < 3,
  });

  if (!isValidMovieId) {
    return <MovieNotFound />;
  }

  if (movieDetailQuery.isPending) {
    return (
      <main className="flex flex-1 flex-col">
        <LoadingState />
      </main>
    );
  }

  if (movieDetailQuery.isError) {
    if (isNotFoundError(movieDetailQuery.error)) {
      return <MovieNotFound />;
    }
    return (
      <main className="flex flex-1 flex-col">
        <ErrorState error={movieDetailQuery.error} onRetry={() => movieDetailQuery.refetch()} />
      </main>
    );
  }

  return <MovieDetail key={movieId} movie={movieDetailQuery.data} />;
}

function MovieNotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 py-40">
      <p className="text-lg text-ink-2">영화를 찾을 수 없어요.</p>
      <Link to="/" className="text-sm font-bold text-primary">
        영화 목록으로 돌아가기
      </Link>
    </main>
  );
}

function MovieDetail({ movie }: { movie: MovieDetailData }) {
  const bookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(movie.id),
  );
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  return (
    <main className="flex flex-1 flex-col">
      <section className="relative h-[360px] w-full overflow-hidden">
        {movie.backdropUrl ? (
          <img
            src={movie.backdropUrl}
            alt=""
            className="pointer-events-none absolute inset-0 size-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-ink" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/30" />
        <div className="absolute inset-0 mx-auto flex max-w-[1440px] flex-col justify-between px-20 py-6 text-white">
          <Link to="/" className="flex items-center gap-1 text-[13px] font-bold">
            <img src="/icons/movie-icons/chevron-left.svg" alt="" className="size-6 invert" />
            영화 목록
          </Link>
          <div className="flex w-[800px] max-w-full flex-col gap-2">
            <h1 className="text-[46px] font-bold leading-[49.68px] tracking-[-2.3px]">
              {movie.title}
            </h1>
            <p className="text-sm">{movie.originalTitle}</p>
            <div className="flex items-center gap-2 text-[13px] font-bold">
              <span>{movie.releaseDate}</span>
              <span>{movie.genres.join(" · ")}</span>
              <span>{movie.runtime}</span>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto flex w-full max-w-[1440px] items-start gap-8 px-20 py-6">
        <div className="h-[286px] w-[200px] shrink-0 overflow-hidden rounded-[10px] bg-page shadow-[0_12px_30px_rgba(12,15,20,0.12)]">
          <MoviePoster src={movie.posterUrl} alt={movie.title} className="size-full" />
        </div>

        <section className="flex min-w-0 flex-1 flex-col items-start gap-3">
          {movie.tagline && (
            <h2 className="text-[21px] font-bold tracking-[-0.63px]">{movie.tagline}</h2>
          )}
          <p className="text-sm leading-6 text-ink-2">
            {movie.overview || "등록된 줄거리가 없어요."}
          </p>
          <button
            type="button"
            aria-pressed={bookmarked}
            onClick={() => toggleBookmark(movie.id)}
            className={cn(
              "flex h-[42px] items-center gap-2 rounded-lg px-4 text-sm font-extrabold text-white",
              bookmarked ? "bg-ink" : "bg-primary",
            )}
          >
            <img
              src={
                bookmarked
                  ? "/icons/movie-icons/bookmark.svg"
                  : "/icons/movie-icons/bookmark-outline.svg"
              }
              alt=""
              className="size-4 invert"
            />
            즐겨찾기
          </button>
        </section>

        <aside className="flex w-[360px] shrink-0 flex-col items-start gap-2 border-l border-line pb-[41px] pl-[30px]">
          <h2 className="text-[21px] font-bold tracking-[-0.63px]">내 평점</h2>
          <p className="text-xs text-ink-3">별점은 필수, 후기는 선택이에요.</p>
          <div className="flex gap-1">
            {STARS.map((n) => (
              <button
                key={n}
                type="button"
                aria-label={`${n}점`}
                aria-pressed={rating === n}
                onClick={() => setRating(n)}
                className="flex size-[38px] items-center justify-center rounded-lg border border-line bg-surface"
              >
                <span
                  className={cn(
                    "size-6 bg-ink-2 [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain]",
                    n <= rating && "bg-amber-400",
                  )}
                  style={{
                    maskImage: "url(/icons/movie-icons/star.svg)",
                    WebkitMaskImage: "url(/icons/movie-icons/star.svg)",
                  }}
                />
              </button>
            ))}
          </div>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="영화를 보고 느낀 점을 남겨보세요."
            className="h-[102px] w-full resize-none rounded-lg border border-line bg-surface px-3 pb-[18px] pt-4 text-[13px] leading-[19.5px] outline-none placeholder:text-ink-3"
          />
          <button
            type="button"
            className="h-[42px] w-full rounded-lg bg-ink text-sm font-extrabold text-white"
          >
            평점 저장
          </button>
        </aside>
      </div>
    </main>
  );
}

export default MovieDetailPage;
