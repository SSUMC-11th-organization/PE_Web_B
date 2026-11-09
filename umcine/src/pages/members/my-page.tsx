import { Link } from "@tanstack/react-router";
import { isHTTPError } from "ky";
import { useEffect, useState, type SubmitEvent } from "react";
import { getMemberRatings } from "../../api/members/get-member-ratings";
import type { MemberRating } from "../../api/members/models";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import type { TmdbMovieDetail } from "../../api/movies/models";
import StatusMessage from "../../components/common/status-message";
import MoviePoster from "../../components/movies/movie-poster";
import { useProfileStore } from "../../stores/profile-store";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";

// 평점(우리 백엔드)과 영화 정보(TMDB)를 합친 화면용 타입이에요. TMDB 요청이 실패하면 movie는 null이에요.
interface RatingWithMovie extends MemberRating {
  movie: TmdbMovieDetail | null;
}

export function MyPage() {
  const profile = useProfileStore((state) => state.profile);
  // 로그인 API(8주차) 연결 전이라 회원 번호를 직접 골라서 조회해요.
  const [memberIdText, setMemberIdText] = useState("1");
  const [memberId, setMemberId] = useState(1);
  const [ratings, setRatings] = useState<RatingWithMovie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // 회원 번호가 바뀌거나 다시 시도하면 렌더링 중에 이전 결과를 비워요.
  const requestKey = `${memberId}|${retryCount}`;
  const [prevRequestKey, setPrevRequestKey] = useState(requestKey);
  if (requestKey !== prevRequestKey) {
    setPrevRequestKey(requestKey);
    setRatings([]);
    setErrorMessage(null);
    setIsLoading(true);
  }

  useEffect(() => {
    let ignore = false;

    async function loadRatings() {
      try {
        const memberRatings = await getMemberRatings(memberId);
        // 평점에는 movieId만 있으니 TMDB에서 제목 · 포스터를 함께 불러와요.
        const ratingsWithMovie = await Promise.all(
          memberRatings.map(async (rating) => ({
            ...rating,
            movie: await getMovieDetail(rating.movieId).catch(() => null),
          })),
        );
        if (!ignore) setRatings(ratingsWithMovie);
      } catch (error) {
        if (!ignore) {
          setErrorMessage(
            isHTTPError(error) && error.response.status === 404
              ? "존재하지 않는 회원이에요."
              : "평점을 불러오지 못했어요.",
          );
        }
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    loadRatings();

    return () => {
      ignore = true;
    };
  }, [memberId, retryCount]);

  function handleMemberSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextMemberId = Number(memberIdText);
    if (Number.isInteger(nextMemberId) && nextMemberId > 0) setMemberId(nextMemberId);
  }

  function renderRatings() {
    if (isLoading) return <StatusMessage message="평점을 불러오는 중이에요." />;
    if (errorMessage) {
      // 없는 회원은 다시 시도해도 같은 결과이므로 다시 시도 버튼을 보여 주지 않아요.
      const canRetry = errorMessage !== "존재하지 않는 회원이에요.";
      return (
        <StatusMessage
          message={errorMessage}
          onRetry={canRetry ? () => setRetryCount((count) => count + 1) : undefined}
        />
      );
    }
    if (ratings.length === 0) return <StatusMessage message="아직 남긴 평점이 없어요." />;

    return (
      <ul className="flex flex-col gap-4">
        {ratings.map((rating) => (
          <li
            key={rating.ratingId}
            className="flex gap-5 rounded-[10px] border border-border-default bg-bg-surface p-4"
          >
            <MoviePoster
              className="h-[130px] w-[90px] shrink-0 rounded-lg"
              src={getTmdbPosterUrl(rating.movie?.poster_path ?? null)}
              alt={`${rating.movie?.title ?? "영화"} 포스터`}
            />
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <h3 className="text-lg font-extrabold text-text-primary">
                {rating.movie?.title ?? `영화 #${rating.movieId}`}
              </h3>
              <p className="flex items-center gap-0.5" aria-label={`별점 ${rating.score}점`}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <img
                    key={star}
                    className="size-4"
                    src={star <= rating.score ? "/icons/star.svg" : "/icons/star-outline.svg"}
                    alt=""
                  />
                ))}
                <span className="ml-1 text-sm font-bold text-text-primary">{rating.score}</span>
              </p>
              <p className="mt-1 text-sm text-text-secondary">{rating.comment || "코멘트가 없어요."}</p>
              <div className="mt-auto flex items-center justify-between gap-3">
                <p className="text-xs text-text-tertiary">{rating.createdAt.slice(0, 10)}</p>
                <Link
                  className="text-sm font-bold text-action-primary hover:underline"
                  to="/movies/$movieId"
                  params={{ movieId: String(rating.movieId) }}
                >
                  상세 보기
                </Link>
              </div>
            </div>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <main className="mx-auto max-w-[1440px] px-4 pt-6 pb-16 md:px-20">
      <h1 className="mb-8 text-[38px] leading-[44px] font-bold tracking-[-1.71px] text-text-primary">
        내 정보
      </h1>

      <section className="mb-12">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 className="text-2xl font-bold tracking-[-0.8px] text-text-primary">프로필</h2>
          <Link
            className="flex h-10 items-center gap-1.5 rounded-lg border border-border-default bg-bg-surface px-4 text-sm font-bold text-text-secondary hover:bg-bg-page"
            to="/my/edit"
          >
            <img className="size-4" src="/icons/edit.svg" alt="" />
            수정하기
          </Link>
        </div>
        <div className="flex flex-col gap-6 rounded-[10px] border border-border-default bg-bg-surface p-6 md:flex-row md:items-center">
          <div className="flex size-20 shrink-0 items-center justify-center rounded-full bg-bg-page">
            <img className="size-10" src="/icons/person.svg" alt="" />
          </div>
          <dl className="grid flex-1 gap-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="mb-1 text-text-tertiary">닉네임</dt>
              <dd className="text-lg font-bold text-text-primary">{profile.nickname}</dd>
            </div>
            <div>
              <dt className="mb-1 text-text-tertiary">이메일</dt>
              <dd className="flex items-center gap-1.5 font-medium text-text-primary">
                <img className="size-4" src="/icons/mail.svg" alt="" />
                {profile.email}
              </dd>
            </div>
            <div>
              <dt className="mb-1 text-text-tertiary">한 줄 소개</dt>
              <dd className="text-text-secondary">{profile.bio || "소개가 없어요."}</dd>
            </div>
            <div>
              <dt className="mb-1 text-text-tertiary">가입일</dt>
              <dd className="text-text-secondary">{profile.joinedAt}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-bold tracking-[-0.8px] text-text-primary">
            내 평점
            {!isLoading && !errorMessage && (
              <span className="ml-3 text-sm font-normal text-text-tertiary">{ratings.length}개</span>
            )}
          </h2>
          <form className="flex items-center gap-2" onSubmit={handleMemberSubmit}>
            <label className="text-sm text-text-secondary" htmlFor="member-id">
              회원 번호
            </label>
            <input
              id="member-id"
              className="h-10 w-20 rounded-lg border border-border-default bg-bg-surface px-3 text-sm text-text-primary outline-none focus:border-action-primary"
              type="number"
              min={1}
              value={memberIdText}
              onChange={(event) => setMemberIdText(event.target.value)}
            />
            <button
              className="h-10 cursor-pointer rounded-lg bg-action-primary px-4 text-sm font-bold text-white"
              type="submit"
            >
              조회
            </button>
          </form>
        </div>
        {renderRatings()}
      </section>
    </main>
  );
}
