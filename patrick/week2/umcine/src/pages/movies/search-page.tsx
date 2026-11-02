import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode, type SubmitEvent } from "react";
import { searchMovies } from "../../api/movies/search-movies";
import type { TmdbMovieListItem } from "../../api/movies/models";
import { BookmarkButton } from "../../components/bookmark-button";
import { ErrorMessage } from "../../components/error-message";
import { TmdbFooter } from "../../components/layout/tmdb-footer";
import { getTmdbPosterUrl } from "../../utils/movies/tmdb-image";

export function SearchPage() {
  const { query = "" } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });
  const [searchText, setSearchText] = useState(query);

  const [movies, setMovies] = useState<TmdbMovieListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    setSearchText(query);
  }, [query]);

  useEffect(() => {
    let ignore = false;
    const normalizedQuery = query.trim();

    setMovies([]);
    setErrorMessage(null);

    if (!normalizedQuery) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    searchMovies({ query: normalizedQuery })
      .then((response) => {
        if (!ignore) setMovies(response.results);
      })
      .catch(() => {
        if (!ignore) setErrorMessage("검색 결과를 불러오지 못했어요.");
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [query, retryKey]);

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextQuery = searchText.trim();
    navigate({
      search: nextQuery ? { query: nextQuery } : {},
    });
  }

  let content: ReactNode;
  if (!query.trim()) {
    content = <p>검색어를 입력해 주세요.</p>;
  } else if (isLoading) {
    content = <p>검색 결과를 불러오는 중이에요.</p>;
  } else if (errorMessage) {
    content = (
      <ErrorMessage
        message={errorMessage}
        onRetry={() => setRetryKey((key) => key + 1)}
      />
    );
  } else if (movies.length === 0) {
    content = <p>검색 결과가 없어요.</p>;
  } else {
    content = (
      <>
        <h2>‘{query}’ 검색 결과</h2>
        <p>영화 {movies.length}편</p>
        <ul>
          {movies.map((movie) => {
            const posterUrl = getTmdbPosterUrl(movie.poster_path);

            return (
              <li key={movie.id}>
                {posterUrl ? (
                  <img src={posterUrl} alt={`${movie.title} 포스터`} />
                ) : (
                  <div>이미지 없음</div>
                )}
                <BookmarkButton movieId={movie.id} />
                <h3>{movie.title}</h3>
                <p>{movie.original_title}</p>
                <p>{movie.release_date}</p>
                <p>{movie.overview}</p>
                <Link
                  to="/movies/$movieId"
                  params={{ movieId: String(movie.id) }}
                >
                  상세 보기
                </Link>
              </li>
            );
          })}
        </ul>
      </>
    );
  }

  return (
    <>
      <main>
        <h1>영화 검색</h1>
        <form onSubmit={handleSubmit}>
          <input
            aria-label="검색어"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
          />
          <button type="submit">검색</button>
        </form>

        {content}
      </main>
      <TmdbFooter />
    </>
  );
}