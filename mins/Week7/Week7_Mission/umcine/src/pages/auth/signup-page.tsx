import { Link, useNavigate } from "@tanstack/react-router";
import { type SubmitEvent, useRef, useState } from "react";
import { checkEmailDuplicate } from "../../api/members/check-email-duplicate";
import { checkNicknameDuplicate } from "../../api/members/check-nickname-duplicate";
import { signup } from "../../api/members/signup";
import { FormField } from "../../components/auth/form-field";
import {
  isEmailValid,
  isNicknameValid,
  isPasswordValid,
  PASSWORD_HINT,
} from "../../utils/member-validation";

const emptyForm = { email: "", nickname: "", password: "", passwordConfirm: "" };
type Field = keyof typeof emptyForm;
type DuplicateField = "email" | "nickname";
type CheckState = "idle" | "checking" | "available" | "taken" | "error";

export function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [checks, setChecks] = useState<Record<DuplicateField, CheckState>>({
    email: "idle",
    nickname: "idle",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  // React 상태 반영 전의 빠른 연속 클릭도 한 번만 요청한다.
  const pending = useRef({ email: false, nickname: false, submit: false });
  const valid = {
    email: isEmailValid(form.email),
    nickname: isNicknameValid(form.nickname),
    password: isPasswordValid(form.password),
    passwordConfirm: Boolean(form.passwordConfirm) && form.password === form.passwordConfirm,
  };
  const canSubmit =
    Object.values(valid).every(Boolean) &&
    checks.email === "available" &&
    checks.nickname === "available";

  function changeField(key: Field, value: string) {
    if (pending.current.submit || ((key === "email" || key === "nickname") && pending.current[key]))
      return;
    if (key === "email" || key === "nickname")
      setChecks((previous) => ({ ...previous, [key]: "idle" }));
    setForm((previous) => ({ ...previous, [key]: value }));
  }

  async function checkDuplicate(key: DuplicateField) {
    if (!valid[key] || pending.current[key] || pending.current.submit) return;
    pending.current[key] = true;
    setChecks((previous) => ({ ...previous, [key]: "checking" }));
    const label = key === "email" ? "이메일" : "닉네임";
    try {
      const response = await (key === "email"
        ? checkEmailDuplicate(form.email.trim())
        : checkNicknameDuplicate(form.nickname.trim()));
      if (typeof response.available !== "boolean") throw new Error("잘못된 중복 확인 응답");
      setChecks((previous) => ({ ...previous, [key]: response.available ? "available" : "taken" }));
      window.alert(
        response.available ? `사용할 수 있는 ${label}이에요.` : `이미 사용 중인 ${label}이에요.`,
      );
    } catch {
      setChecks((previous) => ({ ...previous, [key]: "error" }));
      window.alert("중복 확인에 실패했어요. 다시 시도해 주세요.");
    } finally {
      pending.current[key] = false;
    }
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit || pending.current.submit) return;
    pending.current.submit = true;
    setIsSubmitting(true);
    try {
      const response = await signup({
        email: form.email.trim(),
        nickname: form.nickname.trim(),
        password: form.password,
      });
      if (!response.isSuccess) {
        window.alert(response.message || "회원가입에 실패했어요. 다시 시도해 주세요.");
        return;
      }
      window.alert(response.message || "회원가입이 완료되었어요.");
      await navigate({ to: "/login" });
    } catch {
      window.alert("회원가입에 실패했어요. 다시 시도해 주세요.");
    } finally {
      pending.current.submit = false;
      setIsSubmitting(false);
    }
  }

  function duplicateButton(key: DuplicateField) {
    return (
      <button
        className="duplicate-button"
        type="button"
        disabled={!valid[key] || checks[key] === "checking" || isSubmitting}
        onClick={() => checkDuplicate(key)}
      >
        {checks[key] === "checking" ? "확인 중" : "중복 확인"}
      </button>
    );
  }

  function checkMessage(key: DuplicateField) {
    if (checks[key] === "idle" || checks[key] === "checking") return null;
    const label = key === "email" ? "이메일" : "닉네임";
    return (
      <p role="status" className={checks[key] === "available" ? "field-success" : "field-error"}>
        {checks[key] === "available"
          ? `사용할 수 있는 ${label}이에요.`
          : checks[key] === "taken"
            ? `이미 사용 중인 ${label}이에요.`
            : "중복 확인에 실패했어요. 다시 시도해 주세요."}
      </p>
    );
  }

  return (
    <main className="auth-main">
      <section className="auth-card" aria-labelledby="signup-title">
        <h1 id="signup-title">회원가입</h1>
        <form className="member-form" onSubmit={handleSubmit} noValidate aria-busy={isSubmitting}>
          <div>
            <FormField
              id="signup-email"
              label="이메일"
              type="email"
              autoComplete="email"
              placeholder="name@example.com"
              value={form.email}
              onChange={(event) => changeField("email", event.target.value)}
              disabled={checks.email === "checking" || isSubmitting}
              error={form.email && !valid.email ? "이메일 형식을 확인해 주세요." : undefined}
              action={duplicateButton("email")}
            />
            {checkMessage("email")}
          </div>
          <div>
            <FormField
              id="signup-nickname"
              label="닉네임"
              autoComplete="nickname"
              placeholder="2~12자"
              value={form.nickname}
              onChange={(event) => changeField("nickname", event.target.value)}
              disabled={checks.nickname === "checking" || isSubmitting}
              error={
                form.nickname && !valid.nickname ? "닉네임은 2~12자로 입력해 주세요." : undefined
              }
              action={duplicateButton("nickname")}
            />
            {checkMessage("nickname")}
          </div>
          <FormField
            id="signup-password"
            label="비밀번호"
            type="password"
            autoComplete="new-password"
            placeholder="8자 이상"
            value={form.password}
            onChange={(event) => changeField("password", event.target.value)}
            disabled={isSubmitting}
            hint={PASSWORD_HINT}
            error={
              form.password && !valid.password ? "비밀번호를 다시 한 번 확인해 주세요." : undefined
            }
          />
          <FormField
            id="signup-confirm"
            label="비밀번호 확인"
            type="password"
            autoComplete="new-password"
            placeholder="다시 입력"
            value={form.passwordConfirm}
            onChange={(event) => changeField("passwordConfirm", event.target.value)}
            disabled={isSubmitting}
            error={
              form.passwordConfirm && !valid.passwordConfirm
                ? "비밀번호가 일치하지 않아요."
                : undefined
            }
          />
          <button className="primary-button" type="submit" disabled={!canSubmit || isSubmitting}>
            {isSubmitting ? "가입 중" : "가입하기"}
          </button>
        </form>
        <p className="auth-link">
          이미 계정이 있나요? <Link to="/login">로그인</Link>
        </p>
      </section>
    </main>
  );
}
