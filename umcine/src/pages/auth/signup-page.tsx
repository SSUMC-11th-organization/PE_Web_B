import { Link, useNavigate } from "@tanstack/react-router";
import { useState, type SubmitEvent } from "react";
import { checkEmail } from "../../api/members/check-email";
import { checkNickname } from "../../api/members/check-nickname";
import { signup } from "../../api/members/signup";
import { fieldActionButtonClass, primaryButtonClass } from "../../components/auth/button-styles";
import { FormField } from "../../components/auth/form-field";
import { useProfileStore } from "../../stores/profile-store";
import { isValidEmail, isValidNickname, isValidPassword } from "../../utils/auth/validation";

const DEFAULT_FORM = {
  email: "",
  nickname: "",
  password: "",
  passwordConfirm: "",
};

const DEFAULT_DUPLICATE_CHECK = {
  isChecking: false,
  isAvailable: false,
};

type DefaultFormKey = keyof typeof DEFAULT_FORM;
type DuplicateCheckKey = "email" | "nickname";

export function SignupPage() {
  const navigate = useNavigate();
  const updateProfile = useProfileStore((state) => state.updateProfile);

  const [form, setForm] = useState(DEFAULT_FORM);
  const [duplicateCheck, setDuplicateCheck] = useState({
    email: DEFAULT_DUPLICATE_CHECK,
    nickname: DEFAULT_DUPLICATE_CHECK,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 입력값의 유효성 검사
  const isEmailValid = isValidEmail(form.email);
  const isNicknameValid = isValidNickname(form.nickname);
  const isPasswordValid = isValidPassword(form.password);
  const isPasswordConfirmValid =
    form.passwordConfirm.length > 0 && form.password === form.passwordConfirm;

  // 입력을 시작한 필드에만 오류 표시
  const showEmailError = form.email.length > 0 && !isEmailValid;
  const showNicknameError = form.nickname.length > 0 && !isNicknameValid;
  const showPasswordError = form.password.length > 0 && !isPasswordValid;
  const showPasswordConfirmError = form.passwordConfirm.length > 0 && !isPasswordConfirmValid;

  const isFormValid = isEmailValid && isNicknameValid && isPasswordValid && isPasswordConfirmValid;

  // 입력 조건과 두 중복 확인을 모두 통과해야 제출 가능
  const canSubmit =
    isFormValid && duplicateCheck.email.isAvailable && duplicateCheck.nickname.isAvailable;

  const handleChangeField = (key: DefaultFormKey, value: string) => {
    if (key === "email" || key === "nickname") {
      if (duplicateCheck[key].isChecking) return;
      // 확인한 값을 바꾸면 다시 중복 확인해야 함
      setDuplicateCheck((prev) => ({ ...prev, [key]: DEFAULT_DUPLICATE_CHECK }));
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
          ? await checkEmail(form.email.trim())
          : await checkNickname(form.nickname.trim());
      const isAvailable = response.available;
      setDuplicateCheck((prev) => ({ ...prev, [key]: { ...prev[key], isAvailable } }));
      alert(isAvailable ? `사용할 수 있는 ${label}이에요.` : `이미 사용 중인 ${label}이에요.`);
    } catch {
      setDuplicateCheck((prev) => ({ ...prev, [key]: { ...prev[key], isAvailable: false } }));
      alert("중복 확인에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setDuplicateCheck((prev) => ({ ...prev, [key]: { ...prev[key], isChecking: false } }));
    }
  };

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
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
      // 가입한 정보를 내 정보 화면에서 확인할 수 있도록 store에 반영해요.
      updateProfile({ email: response.result.email, nickname: response.result.nickname });
      navigate({ to: "/login" });
    } catch {
      // 실패하면 입력값을 유지한 채 다시 요청할 수 있어요.
      alert("회원가입에 실패했어요. 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex justify-center px-4 py-16">
      <div className="w-full max-w-[440px] rounded-2xl border border-border-default bg-bg-surface p-8">
        <h1 className="mb-2 text-[28px] font-bold tracking-[-1px] text-text-primary">회원가입</h1>
        <p className="mb-8 text-sm text-text-secondary">UMCine에서 좋아하는 영화를 기록해 보세요.</p>

        {/* noValidate는 폼 제출 시 브라우저의 기본 유효성 검사를 끔 */}
        <form className="flex flex-col gap-2" onSubmit={handleSubmit} noValidate>
          <FormField
            id="signup-email"
            label="이메일"
            type="email"
            placeholder="이메일을 입력해 주세요"
            autoComplete="email"
            value={form.email}
            disabled={duplicateCheck.email.isChecking}
            onChange={(e) => handleChangeField("email", e.target.value)}
            showError={showEmailError}
            errorMessage="올바른 이메일 형식이 아니에요."
            showSuccess={duplicateCheck.email.isAvailable}
            successMessage="사용할 수 있는 이메일이에요."
            action={
              <button
                className={fieldActionButtonClass}
                type="button"
                disabled={!isEmailValid || duplicateCheck.email.isChecking}
                onClick={() => handleCheckDuplicate("email")}
              >
                {duplicateCheck.email.isChecking ? "확인 중" : "중복 확인"}
              </button>
            }
          />

          <FormField
            id="signup-nickname"
            label="닉네임"
            placeholder="2~12자로 입력해 주세요"
            autoComplete="nickname"
            value={form.nickname}
            disabled={duplicateCheck.nickname.isChecking}
            onChange={(e) => handleChangeField("nickname", e.target.value)}
            showError={showNicknameError}
            errorMessage="닉네임은 2자 이상 12자 이하로 입력해 주세요."
            showSuccess={duplicateCheck.nickname.isAvailable}
            successMessage="사용할 수 있는 닉네임이에요."
            action={
              <button
                className={fieldActionButtonClass}
                type="button"
                disabled={!isNicknameValid || duplicateCheck.nickname.isChecking}
                onClick={() => handleCheckDuplicate("nickname")}
              >
                {duplicateCheck.nickname.isChecking ? "확인 중" : "중복 확인"}
              </button>
            }
          />

          <FormField
            id="signup-password"
            label="비밀번호"
            type="password"
            placeholder="영문 대소문자, 숫자, 특수문자 포함 8자 이상"
            autoComplete="new-password"
            value={form.password}
            onChange={(e) => handleChangeField("password", e.target.value)}
            showError={showPasswordError}
            errorMessage="영문 대소문자, 숫자, 특수문자(!@#$%^&*)를 모두 포함해 8자 이상 입력해 주세요."
            showSuccess={isPasswordValid}
            successMessage="사용할 수 있는 비밀번호예요."
          />

          <FormField
            id="signup-password-confirm"
            label="비밀번호 확인"
            type="password"
            placeholder="비밀번호를 한 번 더 입력해 주세요"
            autoComplete="new-password"
            value={form.passwordConfirm}
            onChange={(e) => handleChangeField("passwordConfirm", e.target.value)}
            showError={showPasswordConfirmError}
            errorMessage="비밀번호가 일치하지 않아요."
            showSuccess={isPasswordConfirmValid}
            successMessage="비밀번호가 일치해요."
          />

          <button
            className={`${primaryButtonClass} mt-2`}
            type="submit"
            disabled={!canSubmit || isSubmitting}
          >
            {isSubmitting ? "가입 중" : "가입하기"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-text-secondary">
          이미 계정이 있나요?{" "}
          <Link className="font-bold text-action-primary hover:underline" to="/login">
            로그인
          </Link>
        </p>
      </div>
    </main>
  );
}
