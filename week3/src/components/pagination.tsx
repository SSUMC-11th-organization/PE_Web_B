import { cn } from "../utils/cn";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

// 현재 페이지를 가운데에 두고 페이지 번호를 최대 5개까지 보여줘요.
const VISIBLE_PAGE_COUNT = 5;

const getVisiblePages = (page: number, totalPages: number) => {
  const count = Math.min(VISIBLE_PAGE_COUNT, totalPages);
  const start = Math.min(
    Math.max(page - Math.floor(VISIBLE_PAGE_COUNT / 2), 1),
    totalPages - count + 1,
  );
  return Array.from({ length: count }, (_, index) => start + index);
};

function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="페이지 이동" className="mt-12 flex items-center justify-center gap-1.5">
      <button
        type="button"
        aria-label="이전 페이지"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className="flex size-9 items-center justify-center rounded-lg border border-line bg-surface disabled:cursor-default disabled:opacity-40"
      >
        <img src="/icons/movie-icons/chevron-left.svg" alt="" className="size-5" />
      </button>
      {getVisiblePages(page, totalPages).map((pageNumber) => (
        <button
          key={pageNumber}
          type="button"
          aria-current={pageNumber === page ? "page" : undefined}
          onClick={() => onPageChange(pageNumber)}
          className={cn(
            "h-9 min-w-9 rounded-lg px-2 text-sm font-bold",
            pageNumber === page
              ? "bg-ink text-white"
              : "border border-line bg-surface text-ink-2",
          )}
        >
          {pageNumber}
        </button>
      ))}
      <button
        type="button"
        aria-label="다음 페이지"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        className="flex size-9 items-center justify-center rounded-lg border border-line bg-surface disabled:cursor-default disabled:opacity-40"
      >
        <img src="/icons/movie-icons/chevron-right.svg" alt="" className="size-5" />
      </button>
    </nav>
  );
}

export default Pagination;
