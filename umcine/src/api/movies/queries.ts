import { queryOptions } from "@tanstack/react-query";
import { isHTTPError } from "ky";
import { getMovieDetail } from "./get-movie-detail";
import { getMovies } from "./get-movies";
import { searchMovies } from "./search-movies";

const MAX_RETRY_COUNT = 3;

// query key는 큰 범위부터 작은 범위 순서로 쌓아요. ["movies"]로 영화 관련 캐시 전체를 한 번에 다룰 수 있어요.
const movieKeys = {
  all: ["movies"] as const,
  lists: () => [...movieKeys.all, "list"] as const,
  list: (page: number) => [...movieKeys.lists(), { page }] as const,
  searches: () => [...movieKeys.all, "search"] as const,
  search: (query: string, page: number) => [...movieKeys.searches(), { query, page }] as const,
  details: () => [...movieKeys.all, "detail"] as const,
  detail: (movieId: number) => [...movieKeys.details(), movieId] as const,
};

const movieQueries = {
  list: (page: number) =>
    queryOptions({
      queryKey: movieKeys.list(page),
      queryFn: () => getMovies({ page }),
    }),

  search: (query: string, page: number) =>
    queryOptions({
      queryKey: movieKeys.search(query, page),
      queryFn: () => searchMovies({ query, page }),
      // 앞뒤 공백을 제거한 검색어가 있을 때만 요청해요.
      enabled: query.length > 0,
    }),

  detail: (movieId: number) =>
    queryOptions({
      queryKey: movieKeys.detail(movieId),
      queryFn: () => getMovieDetail(movieId),
      enabled: Number.isInteger(movieId) && movieId > 0,
      // 상세 정보는 전역 기본값(1분) 대신 30초 동안만 최신으로 취급해요.
      staleTime: 30 * 1000,
      // 404는 다시 요청해도 결과가 같으므로 재시도하지 않아요.
      retry: (failureCount, error) =>
        !(isHTTPError(error) && error.response.status === 404) && failureCount < MAX_RETRY_COUNT,
    }),
};

export { movieKeys, movieQueries };
