import { createInterface } from "readline/promises";
import { stdin, stdout } from "process";

type Role = "운영진" | "챌린저";

interface Member {
  id: number;
  name: string;
  role: Role;
  githubId?: string;
}

const members: Member[] = [
  { id: 1, name: "이지현", role: "운영진", githubId: "jihyunniee" },
  { id: 2, name: "김민성", role: "운영진" },
  { id: 3, name: "이아린", role: "챌린저" },
  { id: 4, name: "노형원", role: "챌린저" },
  { id: 5, name: "임도현", role: "챌린저" },
];

function getMemberInfo(id: number): string {
  const member = members.find((m) => m.id === id);

  if (!member) {
    return `ID가 ${id}인 회원을 찾을 수 없습니다.`;
  }

  const githubInfo = member.githubId
    ? `GitHub: @${member.githubId}`
    : "GitHub 아이디 없음";

  return `[${member.role}] ${member.name} (ID: ${member.id}) - ${githubInfo}`;
}

async function main() {
  const rl = createInterface({ input: stdin, output: stdout });
  const answer = await rl.question("조회할 회원 ID를 입력하세요: ");
  rl.close();

  const id = Number(answer);

  if (Number.isNaN(id)) {
    console.log("숫자로 된 ID를 입력해주세요.");
    return;
  }

  console.log(getMemberInfo(id));
}

main();
