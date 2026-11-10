import { Link } from "@tanstack/react-router";
import { ProfileAvatar } from "../../components/auth/profile-avatar";
import { Footer } from "../../components/layout/footer";
import { MovieImage } from "../../components/movies/movie-image";
import { movies } from "../../data/movies";
import { useProfileStore } from "../../stores/profile-store";

// 내 정보 API를 연결하기 전, 디자인에 있는 즐겨찾기 예시를 표시한다.
const previewFavorites = movies.filter((movie) => [1, 2, 5].includes(movie.id));
const previewPosters: Record<number, string> = {
  1: "/images/profile/spider-man.png",
  2: "/images/profile/odyssey.png",
  5: "/images/profile/minions.png",
};

export function ProfilePage() {
  const profile = useProfileStore((state) => state.profile);

  return (
    <div className="profile-page">
      <main className="profile-main">
        <section className="profile-content profile-overview" aria-labelledby="profile-title">
          <div className="profile-heading">
            <h1 id="profile-title">내 정보</h1>
            <Link className="primary-button compact-button" to="/profile/edit">
              정보 수정
            </Link>
          </div>
          <section className="profile-info" aria-labelledby="basic-info-title">
            <h2 id="basic-info-title">기본 정보</h2>
            <div className="profile-info-row">
              <ProfileAvatar imageUrl={profile.imageUrl} />
              <dl className="profile-details">
                <div>
                  <dt>닉네임</dt>
                  <dd>{profile.nickname}</dd>
                </div>
                <div>
                  <dt>이메일</dt>
                  <dd>{profile.email}</dd>
                </div>
              </dl>
            </div>
          </section>
          <section className="profile-favorites" aria-labelledby="favorites-title">
            <h2 id="favorites-title">내 즐겨찾기</h2>
            <div className="profile-movie-grid">
              {previewFavorites.map((movie) => (
                <article key={movie.id}>
                  <MovieImage
                    className="profile-poster"
                    src={previewPosters[movie.id]}
                    alt={`${movie.title} 포스터`}
                  />
                  <h3>{movie.title}</h3>
                  <p>{movie.releaseDate}</p>
                </article>
              ))}
            </div>
            <nav className="profile-pagination" aria-label="즐겨찾기 페이지">
              <button type="button" disabled aria-label="이전 페이지">
                <img src="/icons/auth/chevron-left.svg" alt="" />
              </button>
              <button type="button" aria-current="page">
                1
              </button>
              <button type="button" disabled aria-label="다음 페이지">
                <img src="/icons/auth/chevron-right.svg" alt="" />
              </button>
            </nav>
          </section>
        </section>
      </main>
      <Footer logoSrc="/images/profile/tmdb-logo.svg" />
    </div>
  );
}
