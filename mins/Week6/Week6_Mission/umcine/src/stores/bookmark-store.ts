import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface BookmarkStore {
    bookmarkedMovieIds: number[];
    toggleBookmark: (movieId: number) => void;
}

export const useBookmarkStore = create<BookmarkStore>()(
    persist(
        (set) => ({
        bookmarkedMovieIds: [],
        toggleBookmark: (movieId) =>
            set((state) => ({
            bookmarkedMovieIds: state.bookmarkedMovieIds.includes(movieId)
                ? state.bookmarkedMovieIds.filter((id) => id !== movieId)
                : [...state.bookmarkedMovieIds, movieId],
            })),
        }),
        {
            name: "umcine-tmdb-bookmark-store",
            storage: createJSONStorage(() => localStorage),
            // 영화 데이터나 액션 대신 사용자가 선택한 영화 ID만 저장합니다.
            partialize: (state) => ({
                bookmarkedMovieIds: state.bookmarkedMovieIds,
            }),
            },
        ),
);