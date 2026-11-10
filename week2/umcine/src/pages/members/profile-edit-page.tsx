import { useNavigate } from "@tanstack/react-router";
import { useState, type ChangeEvent, type SubmitEvent } from "react";
import { checkNicknameDuplicate } from "../../api/members/check-nickname-duplicate";
import { ProfileAvatar } from "../../components/members/profile-avatar";
import { useAuthStore } from "../../stores/auth-store";
import { useBookmarkStore } from "../../stores/bookmark-store";
import { isNicknameValid } from "../../utils/members/validation";

const MAX_PROFILE_IMAGE_SIZE = 5 * 1024 * 1024;

const inputClassName =
    "h-12 w-full rounded-lg border border-line bg-surface px-3.5 text-sm text-ink outline-none focus:border-ink";
const primaryButtonClassName =
    "flex h-9 shrink-0 cursor-pointer items-center rounded-lg bg-action px-4 text-[13px] font-extrabold text-white transition-colors hover:bg-action-hover disabled:cursor-not-allowed disabled:bg-action-disabled";

export function ProfileEditPage() {
    const navigate = useNavigate();
    const member = useAuthStore((state) => state.member);
    const savedProfileImageUrl = useAuthStore((state) => state.profileImageUrl);
    const updateProfile = useAuthStore((state) => state.updateProfile);
    const logout = useAuthStore((state) => state.logout);

    const [nickname, setNickname] = useState(member?.nickname ?? "");
    const [profileImageUrl, setProfileImageUrl] = useState(savedProfileImageUrl);
    // 중복 확인을 통과한 닉네임이에요. 값을 바꾸면 다시 확인해야 해요.
    const [checkedNickname, setCheckedNickname] = useState<string | null>(null);
    const [isChecking, setIsChecking] = useState(false);

    if (!member) return null;

    const trimmedNickname = nickname.trim();
    const isNicknameChanged = trimmedNickname !== member.nickname;
    const isNicknameFormatValid = isNicknameValid(nickname);
    const isNicknameReady = !isNicknameChanged || checkedNickname === trimmedNickname;
    const hasChanges = isNicknameChanged || profileImageUrl !== savedProfileImageUrl;
    const canSave = hasChanges && isNicknameFormatValid && isNicknameReady;

    async function handleCheckNickname() {
        if (!isNicknameFormatValid || !isNicknameChanged || isChecking) return;

        setIsChecking(true);
        try {
            const { available } = await checkNicknameDuplicate(trimmedNickname);
            setCheckedNickname(available ? trimmedNickname : null);
            alert(available ? "사용할 수 있는 닉네임이에요." : "이미 사용 중인 닉네임이에요.");
        } catch {
            alert("중복 확인에 실패했어요. 다시 시도해 주세요.");
        } finally {
            setIsChecking(false);
        }
    }

    function handleChangeImage(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        // 같은 파일을 다시 골라도 change 이벤트가 발생하도록 비워요
        event.target.value = "";
        if (!file) return;

        if (file.size > MAX_PROFILE_IMAGE_SIZE) {
            alert("프로필 이미지는 5MB 이하로 선택해 주세요.");
            return;
        }
        setProfileImageUrl(URL.createObjectURL(file));
    }

    function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!canSave) return;

        updateProfile({ nickname: trimmedNickname, profileImageUrl });
        navigate({ to: "/profile" });
    }

    function handleWithdraw() {
        if (!confirm("정말 탈퇴할까요? 탈퇴하면 복구할 수 없어요.")) return;

        useBookmarkStore.setState({ bookmarkedMovieIds: [] });
        logout();
        navigate({ to: "/" });
    }

    return (
        <main className="flex flex-1 flex-col px-4 py-6 sm:px-10 lg:px-20">
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-10">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-[38px] leading-[44px] font-bold tracking-[-1.71px] text-ink">
                            내 정보 수정
                        </h1>
                        <p className="text-sm text-ink-secondary">닉네임과 프로필 이미지만 변경할 수 있어요.</p>
                    </div>
                    <button type="submit" disabled={!canSave} className={primaryButtonClassName}>
                        변경사항 저장
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
                    <div className="flex flex-col items-center gap-1.5">
                        <label className="relative cursor-pointer" aria-label="프로필 이미지 변경">
                            <ProfileAvatar imageUrl={profileImageUrl} />
                            <span className="absolute -right-0.5 -bottom-0.5 flex size-6 items-center justify-center rounded-full bg-surface">
                                <img className="size-6" src="/icons/edit.svg" alt="" />
                            </span>
                            <input type="file" accept="image/*" className="sr-only" onChange={handleChangeImage} />
                        </label>
                        <p className="mt-1 text-sm font-bold text-ink">프로필 이미지</p>
                        <p className="text-[11px] text-ink-tertiary">선택 사항 · 최대 5MB</p>
                    </div>

                    <div className="flex flex-col gap-5">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="profile-nickname" className="text-sm font-bold text-ink">
                                닉네임
                            </label>
                            <div className="relative">
                                <input
                                    id="profile-nickname"
                                    type="text"
                                    value={nickname}
                                    disabled={isChecking}
                                    onChange={(event) => setNickname(event.target.value)}
                                    className={`${inputClassName} pr-24`}
                                />
                                <button
                                    type="button"
                                    disabled={!isNicknameFormatValid || !isNicknameChanged || isChecking}
                                    onClick={handleCheckNickname}
                                    className="absolute top-1/2 right-3.5 -translate-y-1/2 cursor-pointer text-xs font-extrabold text-action disabled:cursor-not-allowed disabled:text-ink-tertiary"
                                >
                                    {isChecking ? "확인 중" : "중복 확인"}
                                </button>
                            </div>
                            {!isNicknameFormatValid ? (
                                <p className="text-xs text-danger">닉네임은 2~12자로 입력해 주세요.</p>
                            ) : isNicknameChanged && !isNicknameReady ? (
                                <p className="text-xs text-ink-tertiary">닉네임 중복 확인이 필요해요.</p>
                            ) : null}
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="profile-email" className="text-sm font-bold text-ink">
                                이메일
                            </label>
                            <input
                                id="profile-email"
                                type="email"
                                value={member.email}
                                readOnly
                                className={inputClassName}
                            />
                        </div>
                    </div>
                </div>
            </form>

            <section className="mt-auto flex items-center justify-between gap-4 rounded-lg border border-danger/40 bg-danger/5 px-4 py-3.5">
                <div className="flex flex-col gap-1">
                    <h2 className="text-sm font-extrabold text-danger">회원 탈퇴</h2>
                    <p className="text-xs text-danger">
                        탈퇴하면 작성한 평점, 후기와 즐겨찾기가 모두 삭제되며 복구할 수 없습니다.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={handleWithdraw}
                    className="h-9 shrink-0 cursor-pointer rounded-lg border border-danger bg-surface px-3.5 text-xs font-extrabold text-danger transition-colors hover:bg-danger/10"
                >
                    회원 탈퇴
                </button>
            </section>
        </main>
    );
}
