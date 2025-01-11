/**
 * version 관리는 아래 참조
 * <Major>.<Minor>.<Patch>
 * @see https://semver.org/lang/ko/
 * Major 증가
 * * 테이블 추가
 * Minor 증가
 * * 컬럼 추가
 * Patch 증가
 * * enum 타입 변경
 */
interface DbChange {
    version: string
    cmt: string
}

const dbChanges = [
    {
        version: '1.1.0',
        cmt: '',
    },
] as Readonly<DbChange[]>

// 오름차순 정렬
export default dbChanges.toSorted((a, b) => a.version.localeCompare(b.version))
