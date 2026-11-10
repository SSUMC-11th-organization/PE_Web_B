import { createFileRoute } from "@tanstack/react-router";
import { MyPage } from "../../../pages/members/my-page";

// (protected)는 URL에 포함되지 않는 route group이에요. 로그인이 필요한 페이지를 한 폴더에 모아 둬요.
// 접근 제한(layout, beforeLoad)은 8주차 이후에 이 폴더 단위로 붙일 수 있어요.
export const Route = createFileRoute("/(protected)/my/")({ component: MyPage });
