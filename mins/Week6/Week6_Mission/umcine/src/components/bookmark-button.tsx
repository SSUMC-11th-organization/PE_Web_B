import { useBookmarkStore } from "../stores/bookmark-store";
import { cn } from "../utils/cn";

interface BookmarkButtonProps {
  movieId: number;
}

export function BookmarkButton({ movieId }: BookmarkButtonProps) {
  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(movieId),
  );
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  return (
    <button
      className={cn(
        "inline-flex cursor-pointer items-center gap-1 self-start rounded-lg px-3 py-2 text-xs font-extrabold text-white",
        isBookmarked ? "bg-[#17191e]" : "bg-[#2563eb]",
      )}
      type="button"
      aria-pressed={isBookmarked}
      onClick={() => toggleBookmark(movieId)}
    >
      <img
        className="h-4 w-4 brightness-0 invert"
        src={isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"}
        alt=""
      />
      {isBookmarked ? "북마크 해제" : "북마크 추가"}
    </button>
  );
}