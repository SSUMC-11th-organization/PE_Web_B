import { useState } from "react";
import { checkEmailDuplicate } from "@/api/members/check-email-duplicate";
import { checkNicknameDuplicate } from "@/api/members/check-nickname-duplicate";

const DEFAULT_DUPLICATE_CHECK = {
    isChecking: false,
    isAvailable: false,
};

type DuplicateCheckKey = "email" | "nickname";
// 이메일 형식 검사
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// 영문 대소문자, 숫자, 특수문자(!@#$%^&*)를 모두 포함해 8자 이상
const PASSWORD_REGEX =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;

const DEFAULT_FORM = {
    email: "",
    nickname: "",
    password: "",
    passwordConfirm: "",
};

type DefaultFormKey = keyof typeof DEFAULT_FORM;
type DefaultFormValue = (typeof DEFAULT_FORM)[DefaultFormKey];

export function SignupPage() {
    const [form, setForm] = useState(DEFAULT_FORM);

    // 입력값의 유효성 검사
    const isEmailValid = EMAIL_REGEX.test(form.email.trim());
    const isNicknameValid =
        form.nickname.trim().length >= 2 && form.nickname.trim().length <= 12;
    const isPasswordValid = PASSWORD_REGEX.test(form.password);
    const isPasswordConfirmValid =
        form.passwordConfirm.length > 0 && form.password === form.passwordConfirm;

    // 입력을 시작한 필드에만 오류 표시
    const showEmailError = form.email.length > 0 && !isEmailValid;
    const showNicknameError = form.nickname.length > 0 && !isNicknameValid;
    const showPasswordError = form.password.length > 0 && !isPasswordValid;
    const showPasswordConfirmError =
        form.passwordConfirm.length > 0 && !isPasswordConfirmValid;

    // 모든 입력값이 유효하면 제출 버튼 활성화
    const isFormValid =
        isEmailValid &&
        isNicknameValid &&
        isPasswordValid &&
        isPasswordConfirmValid;

    const handleChangeField = (key: DefaultFormKey, value: DefaultFormValue) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        // 폼 제출 시 페이지 새로고침 방지
        e.preventDefault()

        // 3.4에서 회원가입 API 요청 추가
    };

    // noValidate는 폼 제출 시 브라우저의 기본 유효성 검사를 끔
    return (
        <form onSubmit={handleSubmit} noValidate>
            <input
                type="email"
                value={form.email}
                onChange={(e) => handleChangeField("email", e.target.value)}
            />
            <button type="submit" disabled={!isFormValid}>
                가입하기
            </button>
        </form>
    )
}