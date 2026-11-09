import { redirect } from "@tanstack/react-router";
import { useAuthStore } from "../../stores/auth-store";

// 내 정보 화면은 로그인한 경우에만 볼 수 있어요
export function redirectIfLoggedOut() {
    if (!useAuthStore.getState().member) {
        throw redirect({ to: "/login" });
    }
}
