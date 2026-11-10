import { create } from "zustand";

interface Profile {
  nickname: string;
  email: string;
  imageUrl: string;
}

// 7주차 화면 확인용 상태. 실제 로그인·조회·수정 API는 8주차에 연결한다.
export const useProfileStore = create<{
  profile: Profile;
  updateProfile: (profile: Profile) => void;
}>((set) => ({
  profile: { nickname: "gs0428", email: "gwangsoo@cinemalab.kr", imageUrl: "" },
  updateProfile: (profile) => set({ profile }),
}));
