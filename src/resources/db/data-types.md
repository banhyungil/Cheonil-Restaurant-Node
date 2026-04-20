# PostgreSQL 데이터 타입 정리

현재 [ddl-pg.sql](ddl-pg.sql)에서 사용 중인 데이터 타입 레퍼런스.

## 숫자 타입

| 타입 | 크기 | 범위 | 사용처 예시 |
|---|---|---|---|
| `SMALLINT` | 2 byte | -32,768 ~ 32,767 | `ctg_seq`, `store_seq`, `cnt`, `party_size` |
| `INTEGER` | 4 byte | 약 -21억 ~ 21억 | `amount`, `price` |
| `BIGINT` | 8 byte | 약 -922경 ~ 922경 | `order_seq`, `exps_seq`, `price`(expense) |
| `SMALLSERIAL` | 2 byte | 1 ~ 32,767 | 마스터 테이블 PK (메뉴·가게 등 소량) |
| `SERIAL` | 4 byte | 1 ~ 약 21억 | `m_expense_category.seq`, `m_product.seq` |
| `BIGSERIAL` | 8 byte | 1 ~ 약 922경 | 트랜잭션 PK (`t_order.seq`, `t_expense.seq`) |
| `DOUBLE PRECISION` | 8 byte | 15자리 부동소수 | `latitude`, `longitude` |

## 문자 타입

| 타입 | 특징 | 사용처 예시 |
|---|---|---|
| `CHAR(n)` | 고정 길이, 짧으면 공백 패딩 | `rsv_time CHAR(5)` ("18:30") |
| `VARCHAR(n)` | 가변 길이, n자 제한 | `name VARCHAR(45)`, `cmt VARCHAR(1000)` |

> PG에서는 `CHAR`와 `VARCHAR`의 성능 차이가 거의 없음. 포맷 고정 값("HH:MM")에만 `CHAR` 사용하면 의도 표현에 좋음.

## 날짜/시간 타입

| 타입 | 크기 | 설명 | 사용처 예시 |
|---|---|---|---|
| `DATE` | 4 byte | 날짜만 (YYYY-MM-DD), 시간 정보 없음 | `start_date`, `end_date`, `expense_date` |
| `TIME` | 8 byte | 시간만 (HH:MM:SS), 날짜 정보 없음 | 영업 시작/종료 시각 |
| `TIMESTAMP` | 8 byte | 날짜+시간, **타임존 없음** | (비권장) |
| `TIMESTAMPTZ` | 8 byte | 날짜+시간, **타임존 포함** (UTC 저장 + 세션 타임존 변환) | `created_at`, `order_at`, `pay_at` |
| `INTERVAL` | 16 byte | 기간 (`'1 day'`, `'2 hours'`) | 예약 지속 시간 등 |

> **선택 기준**
> - 날짜만 필요 → `DATE` (예: 예약 시작일, 휴무일)
> - 시각만 필요 → `TIME` 또는 `CHAR(5)` (예: `rsv_time`은 포맷 고정이라 `CHAR(5)` 사용 중)
> - 이벤트 발생 시점 → `TIMESTAMPTZ` (타임존 이슈 방지)
> - `TIMESTAMP`(타임존 없음)는 서버/클라이언트 시간대가 다르면 버그 발생 가능 → 사용 지양

## 불리언 / JSON

| 타입 | 설명 | 사용처 예시 |
|---|---|---|
| `BOOLEAN` | true/false/null | `m_unit.is_unit_cnt` |
| `JSONB` | 바이너리 JSON (파싱 완료 저장, 인덱싱 가능) | `options`, `config`, `unit_cnt_list` |

> `JSON`보다 `JSONB`가 거의 항상 유리 — 조회·인덱스가 필요한 경우 필수.

## ENUM (사용자 정의 타입)

| 타입 | 값 | 사용처 |
|---|---|---|
| `order_status` | `READY`, `COOKED`, `PAID` | `t_order.status` |
| `pay_type` | `CASH`, `CARD` | `t_payment.pay_type` |
| `day_type` | `MON` ~ `SUN` | `m_order_rsv.day_type` |

> 고정 값 집합에 유용. 값 추가는 `ALTER TYPE ... ADD VALUE`로 가능하지만, **제거/순서 변경은 까다로움** — 자주 바뀌는 구분값은 참조 테이블이 더 유연.

## 선택 가이드 요약

- **PK**: 소량·마스터 → `SMALLSERIAL`, 중간 → `SERIAL`, 대량·트랜잭션 → `BIGSERIAL`
- **금액**: 원화 정수면 `INTEGER`로 충분(21억), 누적·통계는 `BIGINT` 고려
- **시간**: 무조건 `TIMESTAMPTZ`
- **옵션/유연 필드**: `JSONB`
- **고정 구분값**: 값 안정적이면 `ENUM`, 자주 바뀌면 참조 테이블
