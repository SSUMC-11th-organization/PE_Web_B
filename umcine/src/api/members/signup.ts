import { backendClient } from "../backend-client";

interface SignupRequest {
  email: string;
  nickname: string;
  password: string;
}

interface SignupResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    memberId: number;
    email: string;
    nickname: string;
  };
}

// POST /members — passwordConfirm은 화면에서만 검사하므로 요청에 포함하지 않아요.
function signup(body: SignupRequest) {
  return backendClient.post("members", { json: body }).json<SignupResponse>();
}

export { signup, type SignupRequest, type SignupResponse };
