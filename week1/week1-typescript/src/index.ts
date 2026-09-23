type StudyMember ={
    ID : number;
    name : string;
    role : string;
    Github? : string;
}

const members : StudyMember[] = [{
    ID : 1,
    name : "도현",
    role : "챌린저",
    Github : "dlaehgus1112-wq"
}
,
{
    ID : 2,
    name : "성준",
    role : "챌린저",
}
]

function FindMember(ID : number) : string{
    const member = members.find(m => m.ID===ID);
    if(!member){
        return "멤버가 존재하지 않습니다.";
    }
    else{
        return 'ID : '+member.ID + ', 이름 : ' + member.name + ', 역할 : ' + member.role + ', Github : ' + (member.Github ? member.Github : "없음");
    }
}

console.log(FindMember(1));
console.log(FindMember(2));
console.log(FindMember(999));