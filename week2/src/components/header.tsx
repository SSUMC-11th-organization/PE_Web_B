import { NavLink } from "react-router-dom";
import "./header.css";

const NAV_ITEMS = [
  { label: "영화", to: "/" },
  { label: "검색", to: "/search" },
  { label: "내 정보", to: "/my" },
];

function Header() {
  return (
    <header className="header">
      <div className="header__inner">
        <div className="header__left">
          <NavLink to="/" className="header__logo">
            <span className="header__logo-icon">
              <img src="/icons/movie-icons/movie.svg" alt="" />
            </span>
            UMCine
          </NavLink>

          <nav className="header__nav">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  isActive ? "header__nav-link header__nav-link--active" : "header__nav-link"
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="header__right">
          <button type="button" className="header__icon-button" aria-label="검색">
            <img src="/icons/movie-icons/search.svg" alt="" />
          </button>
          <button type="button" className="header__login-button">
            로그인
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
