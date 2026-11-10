import { Link } from "@tanstack/react-router";
import { type SubmitEvent, useState } from "react";
import { FormField } from "../../components/auth/form-field";
import { isEmailValid } from "../../utils/member-validation";

export function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isEmailValid(form.email) || !form.password) return;
    setMessage("로그인 화면 확인이 완료되었어요. 실제 로그인 기능은 다음 주차에 연결해요.");
  }

  return (
    <main className="auth-main">
      <section className="auth-card" aria-labelledby="login-title">
        <h1 id="login-title">로그인</h1>
        <form className="member-form" onSubmit={handleSubmit} noValidate>
          <FormField
            id="login-email"
            label="이메일"
            icon="mail"
            type="email"
            autoComplete="email"
            placeholder="name@example.com"
            value={form.email}
            onChange={(event) => {
              setForm({ ...form, email: event.target.value });
              setMessage("");
            }}
            error={
              form.email && !isEmailValid(form.email) ? "이메일 형식을 확인해 주세요." : undefined
            }
          />
          <FormField
            id="login-password"
            label="비밀번호"
            icon="lock"
            type="password"
            autoComplete="current-password"
            placeholder="비밀번호"
            value={form.password}
            onChange={(event) => {
              setForm({ ...form, password: event.target.value });
              setMessage("");
            }}
          />
          <button
            className="primary-button"
            type="submit"
            disabled={!isEmailValid(form.email) || !form.password}
          >
            로그인
          </button>
          {message && (
            <p className="form-notice" role="status">
              {message}
            </p>
          )}
        </form>
        <p className="auth-link login-footer">
          처음이신가요? <Link to="/signup">회원가입</Link>
        </p>
      </section>
    </main>
  );
}
