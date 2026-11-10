import { Link } from "@tanstack/react-router";

// 퍼블리싱용 더미 데이터 (API 연동은 이후 주차)
const MY_INFO = {
  nickname: "gs0428",
  email: "gwangsoo@cinemalab.kr",
};

const FAVORITES = [
  { id: 1, title: "스파이더맨: 브랜드 뉴 데이", releaseDate: "2026.07.29" },
  { id: 2, title: "오디세이", releaseDate: "2026.08.05" },
  { id: 3, title: "미니언즈 & 몬스터즈", releaseDate: "2026.07.15" },
];

export function MyInfoPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-12 pb-16">
      <div className="flex items-center justify-between py-4">
        <h1 className="m-0 text-2xl font-bold text-gray-900">내 정보</h1>
        <Link
          to="/my-info/edit"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white no-underline hover:bg-blue-700"
        >
          정보 수정
        </Link>
      </div>

      <section className="border-t border-gray-200 py-6">
        <h2 className="m-0 mb-4 text-sm font-bold text-gray-900">기본 정보</h2>
        <div className="flex items-center gap-6">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-600">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-7 w-7"
              fill="currentColor"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21a8 8 0 0 1 16 0z" />
            </svg>
          </div>
          <dl className="m-0 grid flex-1 grid-cols-2 gap-6">
            <div>
              <dt className="text-xs text-gray-400">닉네임</dt>
              <dd className="m-0 mt-1 text-sm font-bold text-gray-900">
                {MY_INFO.nickname}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-gray-400">이메일</dt>
              <dd className="m-0 mt-1 text-sm font-bold text-gray-900">
                {MY_INFO.email}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="border-t border-gray-200 py-6">
        <h2 className="m-0 mb-4 text-sm font-bold text-gray-900">내 즐겨찾기</h2>
        <ul className="m-0 grid list-none grid-cols-2 gap-6 p-0 sm:grid-cols-3 md:grid-cols-5">
          {FAVORITES.map((movie) => (
            <li key={movie.id} className="flex flex-col gap-2">
              <div className="flex aspect-[2/3] w-full items-center justify-center rounded-2xl bg-gray-200 text-sm text-gray-500">
                이미지 없음
              </div>
              <h3 className="m-0 text-sm font-bold leading-[1.35]">
                {movie.title}
              </h3>
              <p className="m-0 text-xs text-gray-400">{movie.releaseDate}</p>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex justify-center">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-900 text-xs font-semibold text-white">
            1
          </span>
        </div>
      </section>
    </div>
  );
}
