interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  const start = Math.floor((page - 1) / 5) * 5 + 1;
  const pages = Array.from({ length: Math.min(5, totalPages - start + 1) }, (_, index) => start + index);
  return (
    <nav className="mt-8 flex items-center justify-center gap-2" aria-label="영화 목록 페이지">
      <button className="h-10 w-10 disabled:opacity-30" type="button" aria-label="이전 페이지" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>‹</button>
      {pages.map((number) => (
        <button className={`h-10 w-10 rounded-lg font-bold ${page === number ? "bg-[#17191e] text-white" : "text-[#606774]"}`} type="button" aria-current={page === number ? "page" : undefined} key={number} onClick={() => onPageChange(number)}>{number}</button>
      ))}
      <button className="h-10 w-10 disabled:opacity-30" type="button" aria-label="다음 페이지" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>›</button>
    </nav>
  );
}
