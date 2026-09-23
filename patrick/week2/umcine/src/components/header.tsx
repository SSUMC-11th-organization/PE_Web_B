import "./header.css";

export function Header() {
  return (
    <header className="site-header">
      <p className="site-header__logo">
        <img src="/icons/movie.svg" alt="" />
        UMCine
      </p>
      <nav className="site-header__nav">
        <a href="/">홈</a>
        <a href="/">검색</a>
        <a href="/">내정보</a>
      </nav>
      <button type="button" className="site-header__login">
        로그인
      </button>
    </header>
  );
}
