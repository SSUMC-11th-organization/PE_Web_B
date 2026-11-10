// ky의 baseUrl은 끝에 /가 있어야 "members/..."처럼 상대 경로가 뒤에 이어 붙어요.
const withTrailingSlash = (url: string) => (url.endsWith("/") ? url : `${url}/`);

export const env = {
  apiBaseUrl: withTrailingSlash(import.meta.env.VITE_API_BASE_URL),
};
