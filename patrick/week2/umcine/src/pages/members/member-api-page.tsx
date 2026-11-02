import { HTTPError } from "ky";
import { useState, type SubmitEvent } from "react";
import { checkEmail } from "../../api/members/check-email";
import { checkNickname } from "../../api/members/check-nickname";
import { getMemberRatings } from "../../api/members/get-member-ratings";

function getErrorText(error: unknown) {
  if (error instanceof HTTPError) return `${error.response.status} ${error.response.statusText}`;
  return "서버에 연결하지 못했어요.";
}

export function MemberApiPage() {
  const [nickname, setNickname] = useState("수현");
  const [nicknameResult, setNicknameResult] = useState("");

  const [email, setEmail] = useState("noco@umc.com");
  const [emailResult, setEmailResult] = useState("");

  const [memberId, setMemberId] = useState("1");
  const [ratingsResult, setRatingsResult] = useState("");

  async function handleNickname(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const { available } = await checkNickname(nickname.trim());
      setNicknameResult(available ? "사용할 수 있는 닉네임이에요." : "이미 사용 중인 닉네임이에요.");
    } catch (error) {
      setNicknameResult(getErrorText(error));
    }
  }

  async function handleEmail(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const { available } = await checkEmail(email.trim());
      setEmailResult(available ? "사용할 수 있는 이메일이에요." : "이미 가입된 이메일이에요.");
    } catch (error) {
      setEmailResult(getErrorText(error));
    }
  }

  async function handleRatings(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const ratings = await getMemberRatings(Number(memberId));
      setRatingsResult(JSON.stringify(ratings, null, 2));
    } catch (error) {
      setRatingsResult(getErrorText(error));
    }
  }

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-8 px-12 py-6">
      <h1 className="m-0 text-2xl font-bold">백엔드 API 연동 확인</h1>

      <section className="flex flex-col gap-2">
        <h2 className="m-0 text-lg font-semibold">닉네임 중복 확인</h2>
        <form onSubmit={handleNickname} className="flex gap-2">
          <input
            aria-label="닉네임"
            value={nickname}
            onChange={(event) => setNickname(event.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2"
          />
          <button type="submit" className="rounded-lg bg-gray-900 px-3 py-2 text-sm font-semibold text-white">
            확인
          </button>
        </form>
        <p className="m-0">{nicknameResult}</p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="m-0 text-lg font-semibold">이메일 중복 확인</h2>
        <form onSubmit={handleEmail} className="flex gap-2">
          <input
            aria-label="이메일"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2"
          />
          <button type="submit" className="rounded-lg bg-gray-900 px-3 py-2 text-sm font-semibold text-white">
            확인
          </button>
        </form>
        <p className="m-0">{emailResult}</p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="m-0 text-lg font-semibold">회원 평점 조회</h2>
        <form onSubmit={handleRatings} className="flex gap-2">
          <input
            aria-label="회원 번호"
            value={memberId}
            onChange={(event) => setMemberId(event.target.value)}
            className="w-24 rounded-lg border border-gray-300 px-3 py-2"
          />
          <button type="submit" className="rounded-lg bg-gray-900 px-3 py-2 text-sm font-semibold text-white">
            조회
          </button>
        </form>
        <pre className="m-0 overflow-auto rounded-lg bg-gray-50 p-3 text-sm">{ratingsResult}</pre>
      </section>
    </main>
  );
}
