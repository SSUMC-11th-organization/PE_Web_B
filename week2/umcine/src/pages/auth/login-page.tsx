import { Link, useNavigate } from "@tanstack/react-router";
import { useState, type SubmitEvent } from "react";
import { useAuthStore } from "../../stores/auth-store";
import { EMAIL_REGEX } from "../../utils/members/validation";

const fieldClassName =
    "flex h-12 items-center gap-2.5 rounded-lg border border-line bg-surface px-3.5 focus-within:border-ink";
const inputClassName =
    "min-w-0 flex-1 text-sm text-ink outline-none placeholder:text-ink-tertiary";

export function LoginPage() {
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const canSubmit = EMAIL_REGEX.test(email.trim()) && password.length > 0;

    function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!canSubmit) return;

        // 로그인 API를 연결하기 전이라 비밀번호는 확인하지 않아요.
        login(email.trim());
        navigate({ to: "/" });
    }

    return (
        <main className="flex flex-1 items-center justify-center px-4 py-20">
            <form onSubmit={handleSubmit} noValidate className="flex w-full max-w-[430px] flex-col">
                <h1 className="text-[32px] leading-10 font-bold tracking-[-1.2px] text-ink">로그인</h1>

                <label htmlFor="login-email" className="mt-6 text-sm font-bold text-ink">
                    이메일
                </label>
                <div className={`${fieldClassName} mt-2`}>
                    <img className="size-[18px] opacity-50" src="/icons/mail.svg" alt="" />
                    <input
                        id="login-email"
                        type="email"
                        autoComplete="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        className={inputClassName}
                    />
                </div>

                <label htmlFor="login-password" className="mt-6 text-sm font-bold text-ink">
                    비밀번호
                </label>
                <div className={`${fieldClassName} mt-2`}>
                    <img className="size-[18px] opacity-50" src="/icons/lock.svg" alt="" />
                    <input
                        id="login-password"
                        type="password"
                        autoComplete="current-password"
                        placeholder="비밀번호"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        className={inputClassName}
                    />
                </div>

                <button
                    type="submit"
                    disabled={!canSubmit}
                    className="mt-7 h-12 cursor-pointer rounded-lg bg-action text-sm font-extrabold text-white transition-colors hover:bg-action-hover active:bg-action-pressed disabled:cursor-not-allowed disabled:bg-action-disabled"
                >
                    로그인
                </button>

                <p className="mt-6 text-center text-[13px] text-ink-tertiary">
                    처음이신가요?{" "}
                    <Link to="/signup" className="font-bold text-action hover:underline">
                        회원가입
                    </Link>
                </p>
            </form>
        </main>
    );
}
