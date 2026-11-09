// 이메일 형식 검사
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const NICKNAME_MIN_LENGTH = 2;
export const NICKNAME_MAX_LENGTH = 12;

export function isNicknameValid(nickname: string) {
    const length = nickname.trim().length;
    return length >= NICKNAME_MIN_LENGTH && length <= NICKNAME_MAX_LENGTH;
}
