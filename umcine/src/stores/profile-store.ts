import { create } from "zustand";

interface Profile {
  nickname: string;
  email: string;
  bio: string;
  joinedAt: string;
}

interface ProfileState {
  profile: Profile;
  updateProfile: (next: Partial<Profile>) => void;
}

// 로그인 · 내 정보 API(8주차)를 연결하기 전이라 화면 확인용 내 정보를 store에 둬요.
// 수정 화면에서 저장한 값이 조회 화면에 바로 반영되는지 확인할 수 있어요.
export const useProfileStore = create<ProfileState>((set) => ({
  profile: {
    nickname: "뚜이",
    email: "ddui@umc.com",
    bio: "영화 보는 걸 좋아해요.",
    joinedAt: "2026-11-08",
  },
  updateProfile: (next) => set((state) => ({ profile: { ...state.profile, ...next } })),
}));
