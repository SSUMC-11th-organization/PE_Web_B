import { createFileRoute } from "@tanstack/react-router";
import { ProfileEditPage } from "../pages/members/profile-edit-page";
import { redirectIfLoggedOut } from "../utils/members/redirect-if-logged-out";

export const Route = createFileRoute("/profile/edit")({
    beforeLoad: redirectIfLoggedOut,
    component: ProfileEditPage,
});
