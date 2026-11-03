# 6주차 미션 기록

## 구현 완료
- 5주차 UMCine을 복사하고 기존 UI, ky API 함수, 북마크를 유지했다.
- QueryClientProvider와 개발 환경의 ReactQueryDevtools를 연결했다.
- 목록: ["movies", "list", { page }]로 페이지별 캐시를 구분하고 페이지 이동을 연결했다.
- 검색: ["movies", "search", { query }]로 검색어별 캐시를 구분한다. 공백 제거 후 빈 검색어는 enabled로 요청하지 않는다.
- 상세: ["movies", "detail", movieId]로 캐시를 구분하며 양의 정수 ID만 요청한다.
- 로딩, 오류, 재시도, 빈 결과, 성공 화면을 기존 UI에 연결했다.
- 공통 staleTime은 60초, 상세는 30초, gcTime은 비활성화 후 5분으로 설정했다.
- 선택 미션: src/api/movies/movie-queries.ts에 queryOptions를 모았다.

## 자동 검사
- `pnpm build`: TypeScript 검사 및 프로덕션 빌드 통과.
- `pnpm lint`: ESLint 검사 통과.

## 직접 확인하고 결과를 기록할 항목
아래 항목은 브라우저에서 확인 전이며, 완료한 결과만 Notion에 기록한다.
1. pnpm dev로 실행하고 영화 목록과 Query Devtools를 연다.
2. 브라우저 개발자 도구 Network에서 Fetch/XHR만 표시한다.
3. 목록 1 → 2 → 1 이동을 1분 안에 수행한다. 마지막 1페이지에서 추가 API 요청이 없는지 확인하고 캡처한다. 새로고침은 메모리 캐시를 초기화하므로 하지 않는다.
4. 검색 화면에서 빈 검색어는 API 요청이 없는지, 스파이더맨 검색 결과가 표시되는지 확인한다.
5. 상세 화면에서 영화 데이터와 detail 캐시를 확인한다. 열린 상태로 30초 뒤 stale 상태가 되는지 확인한다. stale 전환 자체는 즉시 재요청을 의미하지 않는다.
6. /movies/abc, /movies/0에서 잘못된 번호 안내가 나오고 상세 API 요청이 없는지 확인한다.
7. Network의 오프라인 모드로 아직 조회하지 않은 페이지를 열어 오류 및 재시도 UI를 확인한다. 기본 재시도로 오류 표시까지 시간이 걸릴 수 있다. 온라인으로 복구한다.
8. 존재하지 않는 검색어로 빈 결과를 확인한다.

## 본인이 할 제출 작업
- 확인 화면 캡처와 실제 확인 결과를 Notion 필수/선택 미션 기록에 붙인다.
- 핵심 키워드와 학습 후기는 직접 이해한 내용으로 작성한다.
- 스터디 인증 사진을 첨부하고 Notion 공유 링크를 UMC에 제출한다.
- 스터디 규칙에 맞는 브랜치/PR과 CodeRabbit 피드백을 진행한다.

## 참고
- https://tanstack.com/query/latest/docs/framework/react/guides/query-options
- https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults

