import { useEffect, useState } from "react";
interface RequestState<T> { key: string; data: T | null; error: string | null }
// 요청 키가 바뀌면 이전 데이터를 숨기고, cleanup으로 늦은 응답을 무시해요.
export function useMovieRequest<T>(key: string, load: () => Promise<T>, errorMessage: (error: unknown) => string, enabled = true) {
  const [attempt, setAttempt] = useState(0);
  const requestKey = `${key}:${attempt}`;
  const [state, setState] = useState<RequestState<T> | null>(null);
  useEffect(() => {
    if (!enabled) return;
    let ignore = false;
    load().then((data) => {
      if (!ignore) setState({ key: requestKey, data, error: null });
    }).catch((error: unknown) => {
      if (!ignore) setState({ key: requestKey, data: null, error: errorMessage(error) });
    });
    return () => { ignore = true; };
  }, [requestKey, load, errorMessage, enabled]);
  const current = enabled && state?.key === requestKey ? state : null;
  return { data: current?.data ?? null, error: current?.error ?? null,
    isLoading: enabled && current === null, retry: () => setAttempt((value) => value + 1) };
}
