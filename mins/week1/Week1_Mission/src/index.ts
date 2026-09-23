// 회원 타입 정의: ID, 이름, 역할은 필수, GitHub 아이디는 선택
type Role = "member" | "leader";

type StudyMember = {
    id: number;
    name: string;
    role: Role;
    githubId?: string;
};

// 서로 다른 정보를 가진 회원 두 명 이상
const members: StudyMember[] = [
    { id: 1, name: "광수", role: "leader", githubId: "gwangsoo" },
  { id: 2, name: "지수", role: "member" }, // githubId 없음
];

// 회원 ID로 정보를 찾아 안내 문구를 만드는 함수
function getMemberIntro(id: number): string {
    const foundMember = members.find((member) => member.id === id);

  // 존재하지 않는 회원 처리
    if (!foundMember) {
    return `ID ${id}번 회원을 찾을 수 없어요.`;
    }

  // GitHub 아이디가 없는 회원 처리 (옵셔널 체이닝 + 널 병합 연산자)
    const githubInfo = foundMember.githubId ?? "등록된 GitHub 아이디 없음";

    return `${foundMember.name}님 (${foundMember.role}) - GitHub: ${githubInfo}`;
}

// 회원 ID 1, 2, 999를 전달한 결과 확인
console.log(getMemberIntro(1));
console.log(getMemberIntro(2));
console.log(getMemberIntro(999));