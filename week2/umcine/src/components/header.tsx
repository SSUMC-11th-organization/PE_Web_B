export default function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <a className="logo" href="/">
          <span className="logo-mark">
            <img src="/icons/movie.svg" alt="" />
          </span>
          <span className="logo-text">UMCine</span>
        </a>

        <nav className="nav">
          <a href="/">영화</a>
          <a href="/">검색</a>
          <a href="/">내 정보</a>
        </nav>
      </div>

      <div className="header-right">
        <button type="button" className="icon-button" aria-label="검색">
          <img src="/icons/search.svg" alt="" />
        </button>
        <button type="button" className="login-button">
          로그인
        </button>
      </div>
    </header>
  );
}
