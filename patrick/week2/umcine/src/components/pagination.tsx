import { useState } from "react";
import "./pagination.css";

const PAGE_NUMBERS = [1, 2, 3, 4, 5];

export function Pagination() {
  const [page, setPage] = useState(1);

  return (
    <nav className="pagination" aria-label="페이지">
      <button
        type="button"
        onClick={() => setPage((current) => Math.max(1, current - 1))}
      >
        <img src="/icons/chevron-left.svg" alt="이전" />
      </button>
      {PAGE_NUMBERS.map((number) => (
        <button
          key={number}
          type="button"
          className={page === number ? "is-active" : undefined}
          onClick={() => setPage(number)}
        >
          {number}
        </button>
      ))}
      <button
        type="button"
        onClick={() => setPage((current) => Math.min(5, current + 1))}
      >
        <img src="/icons/chevron-right.svg" alt="다음" />
      </button>
    </nav>
  );
}
