import { useEffect, useState } from "react";
import { Link, useParams } from "@tanstack/react-router";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import type { TmdbMovieDetail } from "../../api/movies/models";
import { BookmarkButton } from "../../components/bookmark-button";
import { ErrorMessage } from "../../components/error-message";
import { TmdbFooter } from "../../components/layout/tmdb-footer";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";
import {
  getTmdbBackdropUrl,
  getTmdbPosterUrl,
} from "../../utils/movies/tmdb-image";

function formatRuntime(runtime: number | null) {
  if (runtime === null) return "상영 시간 정보가 없어요.";

  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;
  return hours > 0 ? `${hours}시간 ${minutes}분` : `${minutes}분`;
}

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const parsedMovieId = Number(movieId);
  const isValidMovieId = Number.isInteger(parsedMovieId) && parsedMovieId > 0;

  const [movie, setMovie] = useState<TmdbMovieDetail | null>(null);
  const [isLoading, setIsLoading] = useState(isValidMovieId);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let ignore = false;

    setMovie(null);
    setErrorMessage(null);

    if (!isValidMovieId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    getMovieDetail(parsedMovieId)
      .then((response) => {
        if (!ignore) setMovie(response);
      })
      .catch((error) => {
        if (!ignore) setErrorMessage(getMovieDetailErrorMessage(error));
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [parsedMovieId, isValidMovieId, retryKey]);

  if (!isValidMovieId) {
    return <main>올바르지 않은 영화 번호예요.</main>;
  }

  if (isLoading) {
    return <main>영화 정보를 불러오는 중이에요.</main>;
  }

  if (errorMessage) {
    return (
      <main>
        <ErrorMessage
          message={errorMessage}
          onRetry={() => setRetryKey((key) => key + 1)}
        />
      </main>
    );
  }

  if (!movie) {
    return null;
  }

  const backdropUrl = getTmdbBackdropUrl(movie.backdrop_path);
  const posterUrl = getTmdbPosterUrl(movie.poster_path);

  return (
    <>
      <main>
        {backdropUrl ? (
          <img src={backdropUrl} alt="" aria-hidden="true" />
        ) : (
          <div>이미지 없음</div>
        )}
        <Link to="/">영화 목록</Link>
        {posterUrl ? (
          <img src={posterUrl} alt={`${movie.title} 포스터`} />
        ) : (
          <div>이미지 없음</div>
        )}
        <BookmarkButton movieId={movie.id} />
        <h1>{movie.title}</h1>
        <p>{movie.original_title}</p>
        <p>{movie.release_date}</p>
        <p>{movie.genres.map((genre) => genre.name).join(", ")}</p>
        <p>{formatRuntime(movie.runtime)}</p>
        <h2>{movie.tagline}</h2>
        <p>{movie.overview}</p>
      </main>
      <TmdbFooter />
    </>
  );
}