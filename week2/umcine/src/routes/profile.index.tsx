import { createFileRoute } from "@tanstack/react-router";
import { ProfilePage } from "../pages/members/profile-page";
import { redirectIfLoggedOut } from "../utils/members/redirect-if-logged-out";

export const Route = createFileRoute("/profile/")({
    beforeLoad: redirectIfLoggedOut,
    component: ProfilePage,
});
