import { Link } from "@tanstack/react-router";

const navigationClass =
  "text-sm font-bold text-[#606774] no-underline aria-[current=page]:text-[#17191e] aria-[current=page]:underline aria-[current=page]:underline-offset-2";

export function Header() {
  return (
    <header className="flex w-full flex-wrap items-center justify-between gap-4 border-b border-[#e3e6eb] bg-white px-5 py-5 sm:px-10 lg:px-20 lg:py-6">
      <div className="flex min-w-0 flex-wrap items-center gap-5 lg:gap-[42px]">
        <Link
          className="flex items-center gap-[10px] text-xl font-black tracking-[-0.7px] text-[#17191e] no-underline"
          to="/"
          aria-label="UMCine 홈"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-[#17191e]">
            <img className="block h-6 w-6" src="/icons/movie.svg" alt="" />
          </span>
          <span>UMCine</span>
        </Link>

        <nav className="flex items-center gap-5 sm:gap-[30px]" aria-label="주요 메뉴">
          <Link className={navigationClass} to="/" activeOptions={{ exact: true }}>
            영화
          </Link>

          <Link className={navigationClass} to="/search">
            검색
          </Link>

          <Link className={navigationClass} to="/profile">
            내 정보
          </Link>
        </nav>
      </div>

      <div className="flex items-center gap-[10px]">
        <Link
          className="flex h-[42px] w-[42px] items-center justify-center rounded-lg border border-[#e3e6eb] bg-white aria-[current=page]:border-[#2563eb]"
          to="/search"
          aria-label="영화 검색"
        >
          <img className="block h-6 w-6" src="/icons/search.svg" alt="" />
        </Link>

        <Link
          className="flex h-[42px] items-center rounded-lg border border-[#2563eb] bg-[#2563eb] px-4 text-sm font-extrabold text-white no-underline"
          to="/login"
        >
          로그인
        </Link>
      </div>
    </header>
  );
}
