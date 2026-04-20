

// mariadb 연결
// postgres 연결

// maping 정보 등록
// 동일 인터페이스로 배열 생성.
interface Mapping {
    from: string // mariadb 테이블, select * from 에서 전체 데이터 가져오는 용도
    to: string // postgres 테이블, 위와 동일 용도
    columns: // 컬럼 맵핑 정보,
}

// insert는 어떻게?... 조회한 데이터셋을 넣어야하는데
// json으로 넣을수있는 방법이 있나? 아니면 sql? sql이 낫겠다.
// 동적 insert 쿼리 만들어서 다넣어주면될듯.
// 배치처리를 위해 commit은 나중에
