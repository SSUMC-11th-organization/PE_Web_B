import './header.css'

function Header() {
  return (
    <header className="header">
      <div className="header__brand-row">
        <div className="header__brand">
          <img className="header__logo" src="/icons/movie.svg" alt="" />
          <span className="header__mark">UMCine</span>
        </div>
        <nav className="header__menu">
          <a className="header__menu-item header__menu-item--active" href="#">
            영화
          </a>
          <a className="header__menu-item" href="#">
            검색
          </a>
          <a className="header__menu-item" href="#">
            내 정보
          </a>
        </nav>
      </div>
      <div className="header__actions">
        <button className="header__icon-btn" type="button" aria-label="영화 검색">
          <img src="/icons/search.svg" alt="" />
        </button>
        <button className="header__login-btn" type="button">
          로그인
        </button>
      </div>
    </header>
  )
}

export default Header
