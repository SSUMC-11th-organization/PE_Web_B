const pages = [1, 2, 3, 4, 5];

export default function Pagination() {
  return (
    <nav className="pagination" aria-label="영화 목록 페이지">
      <button className="pagination-arrow" type="button" aria-label="이전 페이지">
        <img src="/icons/chevron-left.svg" alt="" />
      </button>

      <div className="page-numbers">
        {pages.map((page) => (
          <button
            className={page === 1 ? "page-button active" : "page-button"}
            type="button"
            aria-current={page === 1 ? "page" : undefined}
            key={page}
          >
            {page}
          </button>
        ))}
      </div>

      <button className="pagination-arrow" type="button" aria-label="다음 페이지">
        <img src="/icons/chevron-right.svg" alt="" />
      </button>
    </nav>
  );
}
