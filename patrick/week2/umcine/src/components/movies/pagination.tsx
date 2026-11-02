import { cn } from "../../utils/cn";

const VISIBLE_PAGE_COUNT = 5;

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  const start = Math.max(
    1,
    Math.min(page - 2, totalPages - VISIBLE_PAGE_COUNT + 1),
  );
  const end = Math.min(totalPages, start + VISIBLE_PAGE_COUNT - 1);
  const pageNumbers = Array.from(
    { length: end - start + 1 },
    (_, index) => start + index,
  );

  return (
    <nav
      className="flex items-center justify-center gap-2 px-12 py-2"
      aria-label="페이지"
    >
      <button
        type="button"
        className="min-w-8 h-8 border-0 bg-transparent text-gray-500 rounded-lg cursor-pointer disabled:opacity-30 disabled:cursor-default"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        <img src="/icons/chevron-left.svg" alt="이전" className="h-4 w-4 mx-auto" />
      </button>
      {pageNumbers.map((number) => (
        <button
          key={number}
          type="button"
          className={cn(
            "min-w-8 h-8 border-0 bg-transparent text-gray-500 rounded-lg cursor-pointer",
            page === number && "bg-gray-900 text-white",
          )}
          aria-current={page === number ? "page" : undefined}
          onClick={() => onPageChange(number)}
        >
          {number}
        </button>
      ))}
      <button
        type="button"
        className="min-w-8 h-8 border-0 bg-transparent text-gray-500 rounded-lg cursor-pointer disabled:opacity-30 disabled:cursor-default"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        <img src="/icons/chevron-right.svg" alt="다음" className="h-4 w-4 mx-auto" />
      </button>
    </nav>
  );
}