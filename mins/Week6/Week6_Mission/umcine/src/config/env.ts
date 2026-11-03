const tmdbApiBaseUrl = import.meta.env.VITE_TMDB_API_BASE_URL;
const tmdbAccessToken = import.meta.env.VITE_TMDB_ACCESS_TOKEN;
if (!tmdbApiBaseUrl || !tmdbAccessToken) {
  throw new Error("TMDB 환경 변수가 필요해요. .env.local을 확인하고 서버를 다시 시작해 주세요.");
}
export const env = { tmdbApiBaseUrl: tmdbApiBaseUrl.replace(/\/+$/, ""), tmdbAccessToken };
