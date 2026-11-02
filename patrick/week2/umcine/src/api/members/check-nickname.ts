import { backendClient } from "../backend-client";
import type { AvailabilityResponse } from "./models";

function checkNickname(nickname: string) {
  return backendClient
    .get(`members/nickname/${encodeURIComponent(nickname)}`)
    .json<AvailabilityResponse>();
}

export { checkNickname };
