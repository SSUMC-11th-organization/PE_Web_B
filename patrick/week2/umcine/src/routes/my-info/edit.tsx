import { createFileRoute } from "@tanstack/react-router";
import { MyInfoEditPage } from "@/pages/my-info/my-info-edit-page";

export const Route = createFileRoute("/my-info/edit")({
  component: MyInfoEditPage,
});
