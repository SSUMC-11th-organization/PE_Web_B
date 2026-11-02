import { backendClient } from "../backend-client";
import type { RatingResponse } from "./models";

function getMemberRatings(memberId: number) {
  return backendClient.get(`members/${memberId}/ratings`).json<RatingResponse[]>();
}

export { getMemberRatings };
