# DB 마이그레이션 계획 (MariaDB → PostgreSQL)

## 1. 테이블 유형 분류 및 Prefix

| 유형        | Prefix | 설명                                   |
| ----------- | ------ | -------------------------------------- |
| Master      | `m_`   | 기준 정보 (메뉴, 매장, 제품 등)        |
| Transaction | `t_`   | 업무 처리 데이터 (주문, 결제, 지출 등) |

## 2. 테이블명 변경

### Master (m\_)

| 현재            | 변경               | 비고      |
| --------------- | ------------------ | --------- |
| MenuCategory    | m_menu_category    |           |
| Menu            | m_menu             |           |
| StoreCategory   | m_store_category   |           |
| Store           | m_store            |           |
| PlaceCategory   | m_place_category   |           |
| ExpenseCategory | m_expense_category |           |
| Supply          | m_ingredient       | 의미 변경 |
| ProductInfo     | m_product_info     |           |
| Product         | m_product          |           |
| Unit            | m_unit             |           |
| Setting         | m_setting          |           |
| OrderRsv        | m_order_rsv        | 예약 템플릿 → 마스터로 분류 |
| OrderMenuRsv    | m_order_menu_rsv   |           |

### Transaction (t\_)

| 현재           | 변경              | 비고                                    |
| -------------- | ----------------- | --------------------------------------- |
| MyOrder        | t_order           | My 제거 (PostgreSQL은 예약어 충돌 없음) |
| OrderMenu      | t_order_menu      |                                         |
| Payment        | t_payment         |                                         |
| Expense        | t_expense         |                                         |
| ExpenseProduct | t_expense_product |                                         |

## 3. 컬럼명 변경

### 공통 적용

| 현재        | 변경              | 적용 대상                                    |
| ----------- | ----------------- | -------------------------------------------- |
| seq         | seq               | 유지                                         |
| ctgSeq      | category_seq      | m_menu, t_expense, m_store, m_store_category |
| suplSeq     | ingredient_seq    | m_product_info                               |
| prdSeq      | product_seq       | t_expense_product                            |
| prdInfoSeq  | product_info_seq  | m_product                                    |
| expsSeq     | expense_seq       | t_expense_product                            |
| abv         | abbreviation      | m_menu                                       |
| cmt         | comment           | 전체                                         |
| placeCtgSeq | place_category_seq| m_store, m_store_category                    |
| storeSeq    | store_seq         | t_order, t_expense, m_order_rsv              |
| menuSeq     | menu_seq          | t_order_menu, m_order_menu_rsv               |
| orderSeq    | order_seq         | t_order_menu, t_payment                      |
| orderRsvSeq | order_rsv_seq     | m_order_menu_rsv                             |
| unitSeq     | unit_seq          | m_product                                    |
| unitCntList | unit_cnt_list     | m_product                                    |
| unitCnt     | unit_cnt          | t_expense_product                            |
| isUnitCnt   | is_unit_cnt       | m_unit                                       |
| payType     | pay_type          | t_payment                                    |
| payAt       | pay_at            | t_payment                                    |
| expenseAt   | expense_at        | t_expense                                    |
| orderAt     | order_at          | t_order                                      |
| cookedAt    | cooked_at         | t_order                                      |
| rsvTime     | rsv_time          | m_order_rsv                                  |
| dayType     | day_type          | m_order_rsv                                  |
| createdAt   | created_at        | 전체                                         |
| updatedAt   | updated_at        | 전체                                         |

### PostgreSQL 전환 시 타입 변경

| MySQL 타입                           | PostgreSQL 타입                     | 비고                              |
| ------------------------------------ | ----------------------------------- | --------------------------------- |
| bigint unsigned auto_increment       | BIGSERIAL                           |                                   |
| int unsigned auto_increment          | SERIAL                              |                                   |
| smallint unsigned auto_increment     | SMALLSERIAL                         |                                   |
| tinyint unsigned                     | SMALLINT                            | PG에 tinyint 없음                 |
| tinyint(1)                           | BOOLEAN                             | isUnitCnt 등                      |
| longtext + json_valid()              | JSONB                               | options, config, unitCntList      |
| datetime default current_timestamp() | TIMESTAMPTZ DEFAULT now()           |                                   |
| enum(...)                            | CREATE TYPE (ENUM)                  | 타입 안전성, 재사용 가능          |
| float                                | DOUBLE PRECISION                    | 위도/경도 정밀도 확보             |

## 4. PostgreSQL 전환 시 주요 변경사항

### 4.1 네이밍 컨벤션

-   PostgreSQL 관례상 **snake_case** 사용 권장 (MenuCategory → menu_category)
-   단, 기존 camelCase 유지도 가능 (따옴표로 감싸야 함)
-   snake_case로 전환 (예: m_menu_category, category_seq)

### 4.2 ENUM 처리 방식 → CREATE TYPE

```sql
CREATE TYPE order_status AS ENUM ('READY', 'COOKED', 'PAID');
CREATE TYPE pay_type AS ENUM ('CASH', 'CARD');
CREATE TYPE day_type AS ENUM ('MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN');
```

> 타입 안전성, ALTER TYPE으로 값 추가 가능, 여러 테이블에서 재사용 가능

### 4.3 JSON → JSONB

-   MariaDB의 `longtext + json_valid()` → PostgreSQL `JSONB`
-   JSONB는 인덱싱, 쿼리 성능 모두 우수

### 4.4 FK 제약조건 → 미추가

-   현재와 동일하게 인덱스만 유지, FK 제약조건 없음
-   데이터 정합성은 애플리케이션 레벨에서 관리

## 5. 작업 순서

### Phase 1: DDL 작성

1. PostgreSQL용 새 DDL 작성 (prefix + 컬럼명 변경 반영)
2. ENUM 타입 생성
3. 테이블 생성 (FK 제약조건 포함 여부 결정 후)
4. 인덱스 생성

### Phase 2: 데이터 마이그레이션

1. MariaDB에서 데이터 export (mysqldump 또는 CSV)
2. 컬럼명 매핑하여 PostgreSQL에 import
3. 시퀀스 값 동기화 (SERIAL의 시작값 조정)
4. 데이터 검증

### Phase 3: 백엔드 코드 수정

1. DB 커넥션 설정 변경 (mysql → pg)
2. 쿼리 수정 (테이블명, 컬럼명 변경 반영)
3. ORM/쿼리빌더 설정 수정
4. MySQL 전용 문법 → PostgreSQL 문법으로 변환

### Phase 4: 테스트 및 전환

1. 전체 API 테스트
2. 데이터 정합성 확인
3. 운영 전환

## 6. 결정 사항

| 항목 | 결정 |
|------|------|
| snake_case 전환 | O |
| FK 제약조건 | 미추가 (인덱스만 유지) |
| ENUM 처리 방식 | CREATE TYPE |
| OrderRsv 유형 | 마스터 (m_) |
| 위도/경도 타입 | DOUBLE PRECISION |
