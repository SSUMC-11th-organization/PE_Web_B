import { useNavigate } from "@tanstack/react-router";
import { type ChangeEvent, type SubmitEvent, useRef, useState } from "react";
import { FormField } from "../../components/auth/form-field";
import { ProfileAvatar } from "../../components/auth/profile-avatar";
import { useProfileStore } from "../../stores/profile-store";
import { isNicknameValid } from "../../utils/member-validation";

export function ProfileEditPage() {
  const profile = useProfileStore((state) => state.profile);
  const updateProfile = useProfileStore((state) => state.updateProfile);
  const [form, setForm] = useState(profile);
  const [notice, setNotice] = useState("");
  const [imageError, setImageError] = useState("");
  const [isReadingImage, setIsReadingImage] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isNicknameValid(form.nickname) || isReadingImage) return;
    updateProfile({ ...form, nickname: form.nickname.trim(), email: profile.email });
    navigate({ to: "/profile" });
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (
      !["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type) ||
      file.size > 5 * 1024 * 1024
    ) {
      setImageError("JPG, PNG, WebP, GIF 이미지를 5MB 이하로 선택해 주세요.");
      return;
    }
    setImageError("");
    setIsReadingImage(true);
    const reader = new FileReader();
    reader.onload = () => {
      const source = String(reader.result);
      const image = new Image();
      image.onload = () => {
        setForm((previous) => ({ ...previous, imageUrl: source }));
        setIsReadingImage(false);
      };
      image.onerror = () => {
        setImageError("이미지를 읽을 수 없어요. 다른 파일을 선택해 주세요.");
        setIsReadingImage(false);
      };
      image.src = source;
    };
    reader.onerror = () => {
      setImageError("이미지를 읽을 수 없어요. 다시 시도해 주세요.");
      setIsReadingImage(false);
    };
    reader.readAsDataURL(file);
  }

  return (
    <main className="profile-main profile-edit-main">
      <section className="profile-content" aria-labelledby="edit-title">
        <form className="profile-edit-form" onSubmit={handleSubmit} noValidate>
          <div className="profile-heading">
            <div>
              <h1 id="edit-title">내 정보 수정</h1>
              <p>닉네임과 프로필 이미지만 변경할 수 있어요.</p>
            </div>
            <button
              type="submit"
              className="primary-button compact-button"
              disabled={!isNicknameValid(form.nickname) || isReadingImage}
            >
              변경사항 저장
            </button>
          </div>
          <div className="profile-grid">
            <div className="profile-avatar">
              <div className="avatar-edit-wrap">
                <ProfileAvatar imageUrl={form.imageUrl} />
                <button
                  type="button"
                  className="avatar-edit-button"
                  aria-label="프로필 이미지 변경"
                  disabled={isReadingImage}
                  onClick={() => fileInput.current?.click()}
                >
                  <img src="/icons/auth/edit.svg" alt="" />
                </button>
              </div>
              <input
                ref={fileInput}
                className="sr-only"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                aria-label="프로필 이미지 파일"
                onChange={handleImageChange}
              />
              <strong>프로필 이미지</strong>
              <span>선택 사항 · 최대 5MB</span>
              {imageError && (
                <p className="field-error" role="alert">
                  {imageError}
                </p>
              )}
            </div>
            <div className="member-form">
              <FormField
                id="profile-nickname"
                label="닉네임"
                autoComplete="nickname"
                placeholder="2~12자"
                value={form.nickname}
                onChange={(event) => {
                  setForm({ ...form, nickname: event.target.value });
                  setNotice("");
                }}
                error={
                  !isNicknameValid(form.nickname) ? "닉네임은 2~12자로 입력해 주세요." : undefined
                }
                action={
                  <button
                    className="duplicate-button"
                    type="button"
                    disabled={!isNicknameValid(form.nickname)}
                    onClick={() => setNotice("닉네임 중복 확인 기능은 준비 중이에요.")}
                  >
                    중복 확인
                  </button>
                }
              />
              <FormField
                id="profile-email"
                label="이메일"
                type="email"
                autoComplete="email"
                value={profile.email}
                readOnly
              />

              {notice && (
                <p role="status" className="form-notice">
                  {notice}
                </p>
              )}
            </div>
          </div>
        </form>
        <div className="withdraw-panel">
          <div>
            <h2>회원 탈퇴</h2>
            <p>탈퇴하면 작성한 평점, 후기와 즐겨찾기가 모두 삭제되며 복구할 수 없습니다.</p>
          </div>
          <button
            type="button"
            onClick={() => setNotice("회원 탈퇴 기능은 아직 연결되지 않았어요.")}
          >
            회원 탈퇴
          </button>
        </div>
      </section>
    </main>
  );
}
