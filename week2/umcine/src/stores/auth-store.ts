import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface Member {
    email: string;
    nickname: string;
}

interface AuthStore {
    member: Member | null;
    /** 선택한 이미지의 미리보기 주소예요. 용량이 커서 localStorage에는 저장하지 않아요. */
    profileImageUrl: string | null;
    login: (email: string) => void;
    logout: () => void;
    updateProfile: (profile: { nickname: string; profileImageUrl: string | null }) => void;
}

// 로그인 API가 아직 없어서, 입력한 이메일로 화면에서만 로그인 상태를 만들어요.
export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            member: null,
            profileImageUrl: null,
            login: (email) =>
                set({
                    // 닉네임은 내 정보 수정에서 바꿀 수 있도록 이메일 앞부분으로 채워요.
                    member: { email, nickname: email.split("@")[0].slice(0, 12) },
                }),
            logout: () => set({ member: null, profileImageUrl: null }),
            updateProfile: ({ nickname, profileImageUrl }) =>
                set((state) => ({
                    member: state.member && { ...state.member, nickname },
                    profileImageUrl,
                })),
        }),
        {
            name: "umcine-auth-store",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ member: state.member }),
        },
    ),
);
