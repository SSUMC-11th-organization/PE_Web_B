import { Link } from "@tanstack/react-router";
import { useState, type SubmitEvent } from "react";
import { primaryButtonClass } from "../../components/auth/button-styles";
import { FormField } from "../../components/auth/form-field";
import { isValidEmail } from "../../utils/auth/validation";

const DEFAULT_FORM = {
  email: "",
  password: "",
};

type LoginFormKey = keyof typeof DEFAULT_FORM;

// 로그인 화면 퍼블리싱이에요. 로그인 API 연동은 8주차에서 진행해요.
export function LoginPage() {
  const [form, setForm] = useState(DEFAULT_FORM);

  const isEmailValid = isValidEmail(form.email);
  const isPasswordFilled = form.password.length > 0;
  const showEmailError = form.email.length > 0 && !isEmailValid;
  const canSubmit = isEmailValid && isPasswordFilled;

  const handleChangeField = (key: LoginFormKey, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit) return;
    // 8주차에서 로그인 API 요청으로 교체해요.
    alert(`${form.email.trim()} 계정으로 로그인을 요청할 거예요. (8주차에서 연결)`);
  };

  return (
    <main className="flex justify-center px-4 py-16">
      <div className="w-full max-w-[440px] rounded-2xl border border-border-default bg-bg-surface p-8">
        <h1 className="mb-2 text-[28px] font-bold tracking-[-1px] text-text-primary">로그인</h1>
        <p className="mb-8 text-sm text-text-secondary">이메일과 비밀번호로 로그인해 주세요.</p>

        <form className="flex flex-col gap-2" onSubmit={handleSubmit} noValidate>
          <FormField
            id="login-email"
            label="이메일"
            type="email"
            placeholder="이메일을 입력해 주세요"
            autoComplete="email"
            value={form.email}
            onChange={(e) => handleChangeField("email", e.target.value)}
            showError={showEmailError}
            errorMessage="올바른 이메일 형식이 아니에요."
          />
          <FormField
            id="login-password"
            label="비밀번호"
            type="password"
            placeholder="비밀번호를 입력해 주세요"
            autoComplete="current-password"
            value={form.password}
            onChange={(e) => handleChangeField("password", e.target.value)}
          />

          <button className={`${primaryButtonClass} mt-2`} type="submit" disabled={!canSubmit}>
            로그인
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-text-secondary">
          아직 계정이 없나요?{" "}
          <Link className="font-bold text-action-primary hover:underline" to="/signup">
            회원가입
          </Link>
        </p>
      </div>
    </main>
  );
}
