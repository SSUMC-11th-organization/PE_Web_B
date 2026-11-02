import { Link } from "@tanstack/react-router";

export function Header() {
  return (
    <header className="flex items-center justify-between gap-6 px-12 py-5">
      <p className="flex items-center gap-2 m-0 text-xl font-extrabold tracking-[-0.04em]">
        <img src="/icons/movie.svg" alt="" className="w-7 h-7" />
        UMCine
      </p>
      <nav className="flex gap-7 text-[15px]">
        <Link
          to="/"
          className="text-gray-500 no-underline hover:text-gray-900"
          activeProps={{ className: "text-gray-900 font-semibold" }}
          activeOptions={{ exact: true }}
        >
          홈
        </Link>
        <Link
          to="/search"
          className="text-gray-500 no-underline hover:text-gray-900"
          activeProps={{ className: "text-gray-900 font-semibold" }}
        >
          검색
        </Link>
        <Link
          to="/members"
          className="text-gray-500 no-underline hover:text-gray-900"
          activeProps={{ className: "text-gray-900 font-semibold" }}
        >
          내정보
        </Link>
      </nav>
      <button
        type="button"
        className="border-0 rounded-lg bg-blue-600 text-white px-4 py-2 text-sm font-semibold cursor-pointer"
      >
        로그인
      </button>
    </header>
  );
}
