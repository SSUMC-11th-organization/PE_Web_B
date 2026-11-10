import { useState, type FormEvent, type ReactNode } from "react";
import { cn } from "../../utils/cn";
import { checkEmailDuplicate } from "../../apis/members/check-email-duplicate";
import { checkNicknameDuplicate } from "../../apis/members/check-nickname-duplicate";
import { signup } from "../../apis/members/signup";
// import { useNavigate } from "@tanstack/react-router";

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
  const [duplicateCheck, setDuplicateCheck] = useState({
    email: DEFAULT_DUPLICATE_CHECK,
    nickname: DEFAULT_DUPLICATE_CHECK,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const navigate = useNavigate();

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

  // 입력 조건과 두 중복 확인을 모두 통과해야 제출 가능
  const canSubmit =
    isFormValid &&
    duplicateCheck.email.isAvailable &&
    duplicateCheck.nickname.isAvailable;

  const handleChangeField = (key: DefaultFormKey, value: DefaultFormValue) => {
    if (key === "email" || key === "nickname") {
      if (duplicateCheck[key].isChecking) return;
      // 확인한 값을 바꾸면 다시 중복 확인해야 함
      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: DEFAULT_DUPLICATE_CHECK,
      }));
    }
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleCheckDuplicate = async (key: DuplicateCheckKey) => {
    const isValid = key === "email" ? isEmailValid : isNicknameValid;
    if (!isValid || duplicateCheck[key].isChecking) return;

    const label = key === "email" ? "이메일" : "닉네임";
    setDuplicateCheck((prev) => ({
      ...prev,
      [key]: { isChecking: true, isAvailable: false },
    }));

    try {
      const response =
        key === "email"
          ? await checkEmailDuplicate(form.email.trim())
          : await checkNicknameDuplicate(form.nickname.trim());
      const isAvailable = response.available;
      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: { ...prev[key], isAvailable },
      }));
      alert(
        isAvailable
          ? `사용할 수 있는 ${label}이에요.`
          : `이미 사용 중인 ${label}이에요.`,
      );
    } catch {
      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: { ...prev[key], isAvailable: false },
      }));
      alert("중복 확인에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setDuplicateCheck((prev) => ({
        ...prev,
        [key]: { ...prev[key], isChecking: false },
      }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    // 폼 제출 시 페이지 새로고침 방지
    e.preventDefault();
    if (!canSubmit || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await signup({
        email: form.email.trim(),
        nickname: form.nickname.trim(),
        password: form.password,
      });
      alert(response.message);
      // 로그인 페이지 연결 후 주석 해제
      // navigate({ to: "/login" });
    } catch {
      // 실패하면 입력값을 유지한 채 다시 요청할 수 있어요.
      alert("회원가입에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // noValidate는 폼 제출 시 브라우저의 기본 유효성 검사를 끔
  return (
    <main className="flex flex-1 items-center justify-center px-20 py-24">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex w-[430px] max-w-full flex-col"
      >
        <h1 className="mb-5 text-[32px] font-bold tracking-[-1.2px]">
          회원가입
        </h1>

        <div className="flex flex-col gap-5">
          <SignupField
            id="signup-email"
            label="이메일"
            error={showEmailError}
            message={
              showEmailError ? "올바른 이메일 형식이 아니에요." : undefined
            }
            action={
              <DuplicateCheckButton
                disabled={!isEmailValid}
                isChecking={duplicateCheck.email.isChecking}
                isAvailable={duplicateCheck.email.isAvailable}
                onClick={() => handleCheckDuplicate("email")}
              />
            }
          >
            <input
              id="signup-email"
              type="email"
              value={form.email}
              onChange={(e) => handleChangeField("email", e.target.value)}
              disabled={duplicateCheck.email.isChecking}
              placeholder="name@example.com"
              autoComplete="email"
              aria-invalid={showEmailError}
              className={INPUT_CLASS}
            />
          </SignupField>

          <SignupField
            id="signup-nickname"
            label="닉네임"
            error={showNicknameError}
            message={
              showNicknameError
                ? "닉네임은 2자 이상 12자 이하로 입력해 주세요."
                : undefined
            }
            action={
              <DuplicateCheckButton
                disabled={!isNicknameValid}
                isChecking={duplicateCheck.nickname.isChecking}
                isAvailable={duplicateCheck.nickname.isAvailable}
                onClick={() => handleCheckDuplicate("nickname")}
              />
            }
          >
            <input
              id="signup-nickname"
              type="text"
              value={form.nickname}
              onChange={(e) => handleChangeField("nickname", e.target.value)}
              disabled={duplicateCheck.nickname.isChecking}
              placeholder="2-12자"
              autoComplete="nickname"
              aria-invalid={showNicknameError}
              className={INPUT_CLASS}
            />
          </SignupField>

          <SignupField
            id="signup-password"
            label="비밀번호"
            error={showPasswordError}
            // 안내 문구는 항상 보여주고, 조건을 만족하지 못하면 빨간색으로 바꿔요.
            message="영문 대소문자, 숫자, 특수문자를 모두 포함해 8자 이상 입력해 주세요"
          >
            <input
              id="signup-password"
              type="password"
              value={form.password}
              onChange={(e) => handleChangeField("password", e.target.value)}
              placeholder="8자 이상"
              autoComplete="new-password"
              aria-invalid={showPasswordError}
              className={INPUT_CLASS}
            />
          </SignupField>

          <SignupField
            id="signup-password-confirm"
            label="비밀번호 확인"
            error={showPasswordConfirmError}
            message={
              showPasswordConfirmError
                ? "비밀번호가 일치하지 않아요."
                : undefined
            }
          >
            <input
              id="signup-password-confirm"
              type="password"
              value={form.passwordConfirm}
              onChange={(e) =>
                handleChangeField("passwordConfirm", e.target.value)
              }
              placeholder="다시 입력"
              autoComplete="new-password"
              aria-invalid={showPasswordConfirmError}
              className={INPUT_CLASS}
            />
          </SignupField>
        </div>

        <button
          type="submit"
          disabled={!canSubmit || isSubmitting}
          className="mt-4 h-[46px] rounded-lg bg-primary text-sm font-extrabold text-white disabled:cursor-default disabled:opacity-40"
        >
          {isSubmitting ? "가입 중" : "가입하기"}
        </button>

        <p className="mt-6 text-center text-xs text-ink-2">
          이미 계정이 있나요? {/* 로그인 페이지가 생기면 Link로 연결해요. */}
          <button
            type="button"
            className="font-bold text-primary underline underline-offset-2"
          >
            로그인
          </button>
        </p>
      </form>
    </main>
  );
}

const INPUT_CLASS =
  "min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-ink-3 disabled:text-ink-3";

interface SignupFieldProps {
  id: string;
  label: string;
  error: boolean;
  message?: string;
  action?: ReactNode;
  children: ReactNode;
}

function SignupField({
  id,
  label,
  error,
  message,
  action,
  children,
}: SignupFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-[13px] font-bold">
        {label}
      </label>
      <div
        className={cn(
          "flex h-12 items-center gap-3 rounded-lg border bg-surface px-4",
          error ? "border-red-500" : "border-line focus-within:border-ink-3",
        )}
      >
        {children}
        {action}
      </div>
      {message && (
        <p className={cn("text-[11px]", error ? "text-red-500" : "text-ink-3")}>
          {message}
        </p>
      )}
    </div>
  );
}

interface DuplicateCheckButtonProps {
  disabled: boolean;
  isChecking: boolean;
  isAvailable: boolean;
  onClick: () => void;
}

function DuplicateCheckButton({
  disabled,
  isChecking,
  isAvailable,
  onClick,
}: DuplicateCheckButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled || isChecking}
      onClick={onClick}
      className="shrink-0 text-xs font-bold text-primary disabled:cursor-default disabled:opacity-40"
    >
      {isChecking ? "확인 중" : isAvailable ? "확인 완료" : "중복 확인"}
    </button>
  );
}
