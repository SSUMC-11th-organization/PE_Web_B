import { Link, useNavigate } from "@tanstack/react-router";
import { useState, type SubmitEvent } from "react";
import { primaryButtonClass } from "../../components/auth/button-styles";
import { FormField } from "../../components/auth/form-field";
import { useProfileStore } from "../../stores/profile-store";
import { isValidNickname, isValidPassword } from "../../utils/auth/validation";

const BIO_MAX_LENGTH = 60;

// 내 정보 수정 화면 퍼블리싱이에요. 수정 API 연동은 8주차에서 진행해요.
export function MyEditPage() {
  const navigate = useNavigate();
  const profile = useProfileStore((state) => state.profile);
  const updateProfile = useProfileStore((state) => state.updateProfile);

  const [form, setForm] = useState({
    nickname: profile.nickname,
    bio: profile.bio,
    password: "",
    passwordConfirm: "",
  });

  const isNicknameValid = isValidNickname(form.nickname);
  // 비밀번호는 바꿀 때만 입력해요. 비워 두면 기존 비밀번호를 유지해요.
  const isChangingPassword = form.password.length > 0 || form.passwordConfirm.length > 0;
  const isPasswordValid = !isChangingPassword || isValidPassword(form.password);
  const isPasswordConfirmValid = !isChangingPassword || form.password === form.passwordConfirm;
  const isBioValid = form.bio.length <= BIO_MAX_LENGTH;

  const isChanged =
    form.nickname.trim() !== profile.nickname ||
    form.bio.trim() !== profile.bio ||
    isChangingPassword;
  const canSubmit =
    isChanged && isNicknameValid && isPasswordValid && isPasswordConfirmValid && isBioValid;

  const handleChangeField = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit) return;
    // 8주차에서 내 정보 수정 API 요청으로 교체해요. 지금은 store에 저장해 조회 화면에 반영해요.
    updateProfile({ nickname: form.nickname.trim(), bio: form.bio.trim() });
    alert("내 정보를 수정했어요.");
    navigate({ to: "/my" });
  };

  return (
    <main className="flex justify-center px-4 py-16">
      <div className="w-full max-w-[520px] rounded-2xl border border-border-default bg-bg-surface p-8">
        <h1 className="mb-8 text-[28px] font-bold tracking-[-1px] text-text-primary">내 정보 수정</h1>

        <form className="flex flex-col gap-2" onSubmit={handleSubmit} noValidate>
          <FormField id="edit-email" label="이메일" value={profile.email} disabled readOnly />

          <FormField
            id="edit-nickname"
            label="닉네임"
            placeholder="2~12자로 입력해 주세요"
            value={form.nickname}
            onChange={(e) => handleChangeField("nickname", e.target.value)}
            showError={!isNicknameValid}
            errorMessage="닉네임은 2자 이상 12자 이하로 입력해 주세요."
          />

          <FormField
            id="edit-bio"
            label={`한 줄 소개 (${form.bio.length}/${BIO_MAX_LENGTH})`}
            placeholder="나를 한 줄로 소개해 주세요"
            value={form.bio}
            onChange={(e) => handleChangeField("bio", e.target.value)}
            showError={!isBioValid}
            errorMessage={`${BIO_MAX_LENGTH}자 이하로 입력해 주세요.`}
          />

          <FormField
            id="edit-password"
            label="새 비밀번호"
            type="password"
            placeholder="바꿀 때만 입력해 주세요"
            autoComplete="new-password"
            value={form.password}
            onChange={(e) => handleChangeField("password", e.target.value)}
            showError={!isPasswordValid}
            errorMessage="영문 대소문자, 숫자, 특수문자(!@#$%^&*)를 모두 포함해 8자 이상 입력해 주세요."
          />

          <FormField
            id="edit-password-confirm"
            label="새 비밀번호 확인"
            type="password"
            placeholder="새 비밀번호를 한 번 더 입력해 주세요"
            autoComplete="new-password"
            value={form.passwordConfirm}
            onChange={(e) => handleChangeField("passwordConfirm", e.target.value)}
            showError={form.passwordConfirm.length > 0 && !isPasswordConfirmValid}
            errorMessage="비밀번호가 일치하지 않아요."
          />

          <div className="mt-2 flex gap-2">
            <Link
              className="flex h-12 flex-1 items-center justify-center rounded-[10px] border border-border-default text-sm font-bold text-text-secondary hover:bg-bg-page"
              to="/my"
            >
              취소
            </Link>
            <button className={`${primaryButtonClass} flex-1`} type="submit" disabled={!canSubmit}>
              저장하기
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
