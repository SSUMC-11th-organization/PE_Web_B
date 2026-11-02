import { backendClient } from "../backend-client";
import type { AvailabilityResponse } from "./models";

function checkEmail(email: string) {
  return backendClient
    .get(`members/email/${encodeURIComponent(email)}`)
    .json<AvailabilityResponse>();
}

export { checkEmail };
