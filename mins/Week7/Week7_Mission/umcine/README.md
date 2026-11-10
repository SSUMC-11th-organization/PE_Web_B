# 7주차 UMCine

Week6 영화 앱을 복사한 누적 프로젝트입니다. 영화 목록·검색·상세, TanStack Query 캐시와 북마크를 유지했습니다.

## 실행

```powershell
pnpm install --frozen-lockfile
Copy-Item .env.example .env.local
# .env.local의 TMDB 토큰을 본인 토큰으로 설정
pnpm dev
```

기존 `.env.local`이 있으면 덮어쓰지 말고 필요한 항목만 추가합니다.

- `VITE_TMDB_API_BASE_URL`: TMDB API 주소
- `VITE_TMDB_ACCESS_TOKEN`: TMDB 읽기 토큰
- `VITE_API_BASE_URL`: 회원 API 주소 (기본 `http://localhost:8080`)

회원 서버는 별도로 실행해야 합니다. 서버 CORS 허용 출처에 프론트 주소를 등록해야 합니다. 현재 서버 저장소의 기본 허용 출처는 `http://localhost:5173`입니다.

## 화면

| 경로 | 기능 |
| --- | --- |
| `/signup` | 입력 검증, 이메일·닉네임 중복 확인, 회원가입 API 요청 |
| `/login` | 이메일·비밀번호 입력, 제출 조건 및 안내 표시 |
| `/profile` | 화면 확인용 프로필 조회 |
| `/profile/edit` | 닉네임·프로필 이미지 수정, 검증 및 저장 |

회원가입은 실제 API 요청 함수에 연결했습니다. 로그인과 내 정보 API는 8주차 범위입니다. 로그인 제출은 인증을 수행하지 않으며, 프로필 저장은 Zustand 메모리에만 반영됩니다. 새로고침하면 예시 프로필로 돌아갑니다. 즐겨찾기는 디자인의 예시 3편을 표시합니다. 수정 화면의 닉네임 중복 확인과 회원 탈퇴 버튼은 미연결 안내를 표시합니다. 이메일은 읽기 전용이며, 프로필 이미지는 최대 5MB로 제한합니다.

## 검사

```powershell
pnpm fix
pnpm check
pnpm typecheck
pnpm lint
pnpm build
```

`build`는 TypeScript 검사와 Vite 빌드를 포함합니다. 파일 기반 라우트 트리는 Vite 실행 시 자동 생성됩니다. 새 경로를 추가한 직후 타입 오류가 있으면 `pnpm dev`를 먼저 실행해 트리를 생성합니다.

구현 및 확인 결과는 `MISSION.md`에 정리했습니다.


Biome는 자동 생성 라우트 트리를 제외한 소스 포맷을 검사하고, 이번 주차 회원 기능에 추가 린트를 적용합니다. 기존 영화 화면을 포함한 전체 TypeScript/React 린트는 ESLint로 검사합니다. 설정 참고: https://biomejs.dev/installation/quick-start/
