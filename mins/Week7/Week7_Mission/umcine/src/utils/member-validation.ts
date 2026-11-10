export const isEmailValid = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
export const isNicknameValid = (value: string) =>
  value.trim().length >= 2 && value.trim().length <= 12;
export const isPasswordValid = (value: string) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/.test(value);
export const PASSWORD_HINT = "영문 대·소문자, 숫자, 특수문자를 모두 포함해 8자 이상 입력해 주세요";
