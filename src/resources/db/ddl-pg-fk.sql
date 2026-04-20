-- =====================================================
-- PostgreSQL DDL (외래키 제약조건 포함 버전)
-- =====================================================
-- 구조: 1) ENUM 2) Extension 3) Tables 4) Indexes 5) Comments 6) FK Constraints
-- =====================================================

-- =====================
-- 1. ENUM Types
-- =====================
CREATE TYPE order_status AS ENUM ('READY', 'COOKED', 'PAID');
CREATE TYPE pay_type AS ENUM ('CASH', 'CARD');
CREATE TYPE day_type AS ENUM ('MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN');
CREATE TYPE rsv_status AS ENUM ('RESERVED', 'COMPLETED', 'CANCELED');

-- =====================
-- 2. Extensions
-- =====================
CREATE EXTENSION IF NOT EXISTS ltree;

-- =====================
-- 3. Master Tables (m_)
-- =====================

CREATE TABLE m_setting (
    seq SMALLSERIAL PRIMARY KEY,
    config JSONB NOT NULL
);

CREATE TABLE m_store_category (
    seq SMALLSERIAL PRIMARY KEY,
    nm VARCHAR(45) NOT NULL UNIQUE,
    options JSONB,
    reg_at TIMESTAMPTZ DEFAULT now(),
    mod_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE m_store (
    seq SMALLSERIAL PRIMARY KEY,
    ctg_seq SMALLINT NOT NULL,
    nm VARCHAR(45) NOT NULL UNIQUE,
    addr VARCHAR(200),
    cmt VARCHAR(1000),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    options JSONB,
    reg_at TIMESTAMPTZ DEFAULT now(),
    mod_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE m_menu_category (
    seq SMALLSERIAL PRIMARY KEY,
    nm VARCHAR(20) NOT NULL UNIQUE,
    options JSONB,
    reg_at TIMESTAMPTZ DEFAULT now(),
    mod_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE m_menu (
    seq SMALLSERIAL PRIMARY KEY,
    ctg_seq SMALLINT NOT NULL,
    nm VARCHAR(45) NOT NULL UNIQUE,
    nm_s VARCHAR(10),
    price INTEGER NOT NULL,
    cmt VARCHAR(1000),
    options JSONB,
    reg_at TIMESTAMPTZ DEFAULT now(),
    mod_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE m_expense_category (
    seq SERIAL PRIMARY KEY,
    path LTREE NOT NULL UNIQUE,
    nm VARCHAR(50) NOT NULL,
    options JSONB
);

CREATE TABLE m_ingredient (
    seq SMALLSERIAL PRIMARY KEY,
    nm VARCHAR(100) NOT NULL,
    options JSONB,
    reg_at TIMESTAMPTZ DEFAULT now(),
    mod_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE m_product_info (
    seq SMALLSERIAL PRIMARY KEY,
    ingd_seq SMALLINT NOT NULL,
    nm VARCHAR(100) NOT NULL,
    cmt VARCHAR(200),
    options JSONB,
    reg_at TIMESTAMPTZ DEFAULT now(),
    mod_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE m_unit (
    seq SMALLSERIAL PRIMARY KEY,
    nm VARCHAR(40) NOT NULL,
    is_unit_cnt BOOLEAN DEFAULT false NOT NULL
);

CREATE TABLE m_product (
    seq SERIAL PRIMARY KEY,
    prd_info_seq SMALLINT NOT NULL,
    unit_seq SMALLINT NOT NULL,
    unit_cnts NUMERIC(6, 2)[]
);

CREATE TABLE m_order_rsv_tmpl (
    seq SMALLSERIAL PRIMARY KEY,
    store_seq SMALLINT NOT NULL,
    nm VARCHAR(40) NOT NULL,
    amount INTEGER NOT NULL,
    rsv_time TIME NOT NULL,
    day_types day_type[] NOT NULL,
    cmt VARCHAR(1000),
    active BOOLEAN DEFAULT true,
    start_dt DATE,
    end_dt DATE,
    options JSONB,
    reg_at TIMESTAMPTZ DEFAULT now(),
    mod_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE m_order_rsv_menu (
    menu_seq SMALLINT NOT NULL,
    rsv_tmpl_seq SMALLINT NOT NULL,
    price INTEGER NOT NULL,
    cnt SMALLINT NOT NULL,
    PRIMARY KEY (menu_seq, rsv_tmpl_seq)
);

-- =====================
-- 4. Transaction Tables (t_)
-- =====================

CREATE TABLE t_order (
    seq BIGSERIAL PRIMARY KEY,
    store_seq SMALLINT NOT NULL,
    rsv_seq BIGINT,
    amount INTEGER NOT NULL,
    status order_status DEFAULT 'READY' NOT NULL,
    order_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    cooked_at TIMESTAMPTZ,
    cmt VARCHAR(1000),
    mod_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TABLE t_order_menu (
    menu_seq SMALLINT NOT NULL,
    order_seq BIGINT NOT NULL,
    price INTEGER NOT NULL,
    cnt SMALLINT NOT NULL,
    PRIMARY KEY (menu_seq, order_seq)
);

CREATE TABLE t_order_rsv (
    seq BIGSERIAL PRIMARY KEY,
    store_seq SMALLINT NOT NULL,
    rsv_tmpl_seq SMALLINT,
    amount INTEGER NOT NULL,
    rsv_at TIMESTAMPTZ NOT NULL,
    status rsv_status DEFAULT 'RESERVED' NOT NULL,
    reg_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    mod_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TABLE t_order_rsv_menu (
    menu_seq SMALLINT NOT NULL,
    rsv_seq BIGINT NOT NULL,
    price INTEGER NOT NULL,
    cnt SMALLINT NOT NULL,
    PRIMARY KEY (menu_seq, rsv_seq)
);

CREATE TABLE t_payment (
    seq BIGSERIAL PRIMARY KEY,
    order_seq BIGINT NOT NULL,
    amount INTEGER NOT NULL,
    pay_type pay_type DEFAULT 'CASH' NOT NULL,
    pay_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE t_expense (
    seq BIGSERIAL PRIMARY KEY,
    ctg_seq INTEGER NOT NULL,
    store_seq SMALLINT,
    nm VARCHAR(50) NOT NULL,
    amount INTEGER NOT NULL,
    expense_at TIMESTAMPTZ NOT NULL,
    cmt VARCHAR(400),
    options JSONB,
    mod_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE t_expense_product (
    exps_seq BIGINT NOT NULL,
    prd_seq INTEGER NOT NULL,
    cnt SMALLINT NOT NULL,
    price BIGINT NOT NULL,
    unit_cnt NUMERIC(6, 2),
    cmt VARCHAR(400),
    PRIMARY KEY (exps_seq, prd_seq)
);

-- =====================
-- 5. Indexes
-- =====================

CREATE INDEX idx_store_ctg ON m_store (ctg_seq);
CREATE INDEX idx_menu_ctg ON m_menu (ctg_seq);
CREATE INDEX idx_exps_ctg_path ON m_expense_category USING GIST (path);
CREATE INDEX idx_product_info_ingd ON m_product_info (ingd_seq);
CREATE INDEX idx_product_prd_info ON m_product (prd_info_seq);
CREATE INDEX idx_product_unit ON m_product (unit_seq);
CREATE INDEX idx_order_rsv_tmpl_store ON m_order_rsv_tmpl (store_seq);
CREATE INDEX idx_order_rsv_menu_tmpl ON m_order_rsv_menu (rsv_tmpl_seq);
CREATE INDEX idx_order_store ON t_order (store_seq);
CREATE INDEX idx_order_rsv ON t_order (rsv_seq);
CREATE INDEX idx_order_menu_order ON t_order_menu (order_seq);
CREATE INDEX idx_order_rsv_store ON t_order_rsv (store_seq);
CREATE INDEX idx_order_rsv_tmpl ON t_order_rsv (rsv_tmpl_seq);
CREATE INDEX idx_order_rsv_menu_rsv ON t_order_rsv_menu (rsv_seq);
CREATE INDEX idx_payment_order ON t_payment (order_seq);
CREATE INDEX idx_expense_ctg ON t_expense (ctg_seq);
CREATE INDEX idx_expense_store ON t_expense (store_seq);
CREATE INDEX idx_expense_product_prd ON t_expense_product (prd_seq);

-- =====================
-- 6. Foreign Key Constraints
-- =====================
-- 정책 요약:
--   RESTRICT : 마스터 데이터 보호 (카테고리, 가게, 메뉴, 제품 등 삭제 방지)
--   CASCADE  : 상세 테이블은 부모와 생명주기 동일 (주문-주문메뉴, 지출-지출상세 등)
--   SET NULL : 선택적 참조 (예약주문 → 템플릿, 주문 → 예약)

-- --- Master ↔ Master ---

ALTER TABLE m_store
    ADD CONSTRAINT fk_store_ctg
    FOREIGN KEY (ctg_seq) REFERENCES m_store_category(seq)
    ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE m_menu
    ADD CONSTRAINT fk_menu_ctg
    FOREIGN KEY (ctg_seq) REFERENCES m_menu_category(seq)
    ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE m_product_info
    ADD CONSTRAINT fk_product_info_ingd
    FOREIGN KEY (ingd_seq) REFERENCES m_ingredient(seq)
    ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE m_product
    ADD CONSTRAINT fk_product_prd_info
    FOREIGN KEY (prd_info_seq) REFERENCES m_product_info(seq)
    ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE m_product
    ADD CONSTRAINT fk_product_unit
    FOREIGN KEY (unit_seq) REFERENCES m_unit(seq)
    ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE m_order_rsv_tmpl
    ADD CONSTRAINT fk_rsv_tmpl_store
    FOREIGN KEY (store_seq) REFERENCES m_store(seq)
    ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE m_order_rsv_menu
    ADD CONSTRAINT fk_rsv_menu_menu
    FOREIGN KEY (menu_seq) REFERENCES m_menu(seq)
    ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE m_order_rsv_menu
    ADD CONSTRAINT fk_rsv_menu_tmpl
    FOREIGN KEY (rsv_tmpl_seq) REFERENCES m_order_rsv_tmpl(seq)
    ON UPDATE CASCADE ON DELETE CASCADE;

-- --- Transaction → Master ---

ALTER TABLE t_order
    ADD CONSTRAINT fk_order_store
    FOREIGN KEY (store_seq) REFERENCES m_store(seq)
    ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE t_order_menu
    ADD CONSTRAINT fk_order_menu_menu
    FOREIGN KEY (menu_seq) REFERENCES m_menu(seq)
    ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE t_order_rsv
    ADD CONSTRAINT fk_t_rsv_store
    FOREIGN KEY (store_seq) REFERENCES m_store(seq)
    ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE t_order_rsv
    ADD CONSTRAINT fk_t_rsv_tmpl
    FOREIGN KEY (rsv_tmpl_seq) REFERENCES m_order_rsv_tmpl(seq)
    ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE t_order_rsv_menu
    ADD CONSTRAINT fk_t_rsv_menu_menu
    FOREIGN KEY (menu_seq) REFERENCES m_menu(seq)
    ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE t_expense
    ADD CONSTRAINT fk_expense_ctg
    FOREIGN KEY (ctg_seq) REFERENCES m_expense_category(seq)
    ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE t_expense
    ADD CONSTRAINT fk_expense_store
    FOREIGN KEY (store_seq) REFERENCES m_store(seq)
    ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE t_expense_product
    ADD CONSTRAINT fk_exps_prd_prd
    FOREIGN KEY (prd_seq) REFERENCES m_product(seq)
    ON UPDATE CASCADE ON DELETE RESTRICT;

-- --- Transaction ↔ Transaction ---

ALTER TABLE t_order
    ADD CONSTRAINT fk_order_rsv
    FOREIGN KEY (rsv_seq) REFERENCES t_order_rsv(seq)
    ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE t_order_menu
    ADD CONSTRAINT fk_order_menu_order
    FOREIGN KEY (order_seq) REFERENCES t_order(seq)
    ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE t_order_rsv_menu
    ADD CONSTRAINT fk_t_rsv_menu_rsv
    FOREIGN KEY (rsv_seq) REFERENCES t_order_rsv(seq)
    ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE t_payment
    ADD CONSTRAINT fk_payment_order
    FOREIGN KEY (order_seq) REFERENCES t_order(seq)
    ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE t_expense_product
    ADD CONSTRAINT fk_exps_prd_exps
    FOREIGN KEY (exps_seq) REFERENCES t_expense(seq)
    ON UPDATE CASCADE ON DELETE CASCADE;

-- =====================================================
-- Table & Column Comments
-- =====================================================

-- ========== m_setting ==========
COMMENT ON TABLE m_setting IS '시스템 전역 설정';
COMMENT ON COLUMN m_setting.seq IS 'PK';
COMMENT ON COLUMN m_setting.config IS '설정 값 (JSON)';

-- ========== m_store_category ==========
COMMENT ON TABLE m_store_category IS '가게 카테고리';
COMMENT ON COLUMN m_store_category.seq IS 'PK';
COMMENT ON COLUMN m_store_category.nm IS '카테고리명';
COMMENT ON COLUMN m_store_category.options IS '부가 옵션 (JSON)';
COMMENT ON COLUMN m_store_category.reg_at IS '등록 시각';
COMMENT ON COLUMN m_store_category.mod_at IS '수정 시각';

-- ========== m_store ==========
COMMENT ON TABLE m_store IS '가게 (지점)';
COMMENT ON COLUMN m_store.seq IS 'PK';
COMMENT ON COLUMN m_store.ctg_seq IS '가게 카테고리 FK (m_store_category.seq)';
COMMENT ON COLUMN m_store.nm IS '가게명';
COMMENT ON COLUMN m_store.addr IS '주소';
COMMENT ON COLUMN m_store.cmt IS '비고';
COMMENT ON COLUMN m_store.latitude IS '위도';
COMMENT ON COLUMN m_store.longitude IS '경도';
COMMENT ON COLUMN m_store.options IS '부가 옵션 (JSON)';
COMMENT ON COLUMN m_store.reg_at IS '등록 시각';
COMMENT ON COLUMN m_store.mod_at IS '수정 시각';

-- ========== m_menu_category ==========
COMMENT ON TABLE m_menu_category IS '메뉴 카테고리';
COMMENT ON COLUMN m_menu_category.seq IS 'PK';
COMMENT ON COLUMN m_menu_category.nm IS '카테고리명';
COMMENT ON COLUMN m_menu_category.options IS '부가 옵션 (JSON)';
COMMENT ON COLUMN m_menu_category.reg_at IS '등록 시각';
COMMENT ON COLUMN m_menu_category.mod_at IS '수정 시각';

-- ========== m_menu ==========
COMMENT ON TABLE m_menu IS '메뉴';
COMMENT ON COLUMN m_menu.seq IS 'PK';
COMMENT ON COLUMN m_menu.ctg_seq IS '메뉴 카테고리 FK (m_menu_category.seq)';
COMMENT ON COLUMN m_menu.nm IS '메뉴명';
COMMENT ON COLUMN m_menu.nm_s IS '짧은 이름 / 약칭';
COMMENT ON COLUMN m_menu.price IS '가격 (원)';
COMMENT ON COLUMN m_menu.cmt IS '비고';
COMMENT ON COLUMN m_menu.options IS '부가 옵션 (JSON)';
COMMENT ON COLUMN m_menu.reg_at IS '등록 시각';
COMMENT ON COLUMN m_menu.mod_at IS '수정 시각';

-- ========== m_expense_category ==========
COMMENT ON TABLE m_expense_category IS '지출 카테고리 (ltree 계층 구조)';
COMMENT ON COLUMN m_expense_category.seq IS 'PK';
COMMENT ON COLUMN m_expense_category.path IS '계층 경로 (예: food.meat.beef)';
COMMENT ON COLUMN m_expense_category.nm IS '카테고리명';
COMMENT ON COLUMN m_expense_category.options IS '부가 옵션 (JSON)';

-- ========== m_ingredient ==========
COMMENT ON TABLE m_ingredient IS '식자재 / 원재료';
COMMENT ON COLUMN m_ingredient.seq IS 'PK';
COMMENT ON COLUMN m_ingredient.nm IS '식자재명';
COMMENT ON COLUMN m_ingredient.options IS '부가 옵션 (JSON)';
COMMENT ON COLUMN m_ingredient.reg_at IS '등록 시각';
COMMENT ON COLUMN m_ingredient.mod_at IS '수정 시각';

-- ========== m_product_info ==========
COMMENT ON TABLE m_product_info IS '제품 정보 (식자재의 상품 정보)';
COMMENT ON COLUMN m_product_info.seq IS 'PK';
COMMENT ON COLUMN m_product_info.ingd_seq IS '식자재 FK (m_ingredient.seq)';
COMMENT ON COLUMN m_product_info.nm IS '제품명';
COMMENT ON COLUMN m_product_info.cmt IS '비고';
COMMENT ON COLUMN m_product_info.options IS '부가 옵션 (JSON)';
COMMENT ON COLUMN m_product_info.reg_at IS '등록 시각';
COMMENT ON COLUMN m_product_info.mod_at IS '수정 시각';

-- ========== m_unit ==========
COMMENT ON TABLE m_unit IS '단위 (kg, 박스, 개 등)';
COMMENT ON COLUMN m_unit.seq IS 'PK';
COMMENT ON COLUMN m_unit.nm IS '단위명';
COMMENT ON COLUMN m_unit.is_unit_cnt IS '단위 수량 사용 여부';

-- ========== m_product ==========
COMMENT ON TABLE m_product IS '제품 (제품 정보 + 단위 조합)';
COMMENT ON COLUMN m_product.seq IS 'PK';
COMMENT ON COLUMN m_product.prd_info_seq IS '제품 정보 FK (m_product_info.seq)';
COMMENT ON COLUMN m_product.unit_seq IS '단위 FK (m_unit.seq)';
COMMENT ON COLUMN m_product.unit_cnts IS '단위별 수량 옵션 배열 (예: {1, 5, 10})';

-- ========== m_order_rsv_tmpl ==========
COMMENT ON TABLE m_order_rsv_tmpl IS '예약 주문 템플릿 (단골 반복 예약)';
COMMENT ON COLUMN m_order_rsv_tmpl.seq IS 'PK';
COMMENT ON COLUMN m_order_rsv_tmpl.store_seq IS '가게 FK (m_store.seq)';
COMMENT ON COLUMN m_order_rsv_tmpl.nm IS '템플릿명 (단골 식별용)';
COMMENT ON COLUMN m_order_rsv_tmpl.amount IS '예약 금액';
COMMENT ON COLUMN m_order_rsv_tmpl.rsv_time IS '예약 시각 (HH:MM)';
COMMENT ON COLUMN m_order_rsv_tmpl.day_types IS '반복 요일 배열 (예: {MON, WED, FRI})';
COMMENT ON COLUMN m_order_rsv_tmpl.cmt IS '비고';
COMMENT ON COLUMN m_order_rsv_tmpl.active IS '활성 여부 (false면 반복 중단)';
COMMENT ON COLUMN m_order_rsv_tmpl.start_dt IS '패턴 시작일';
COMMENT ON COLUMN m_order_rsv_tmpl.end_dt IS '패턴 종료일 (무기한이면 NULL)';
COMMENT ON COLUMN m_order_rsv_tmpl.options IS '부가 옵션 (JSON)';
COMMENT ON COLUMN m_order_rsv_tmpl.reg_at IS '등록 시각';
COMMENT ON COLUMN m_order_rsv_tmpl.mod_at IS '수정 시각';

-- ========== m_order_rsv_menu ==========
COMMENT ON TABLE m_order_rsv_menu IS '예약 템플릿 메뉴 (단골이 고정적으로 주문하는 메뉴)';
COMMENT ON COLUMN m_order_rsv_menu.menu_seq IS '메뉴 FK (m_menu.seq)';
COMMENT ON COLUMN m_order_rsv_menu.rsv_tmpl_seq IS '예약 템플릿 FK (m_order_rsv_tmpl.seq)';
COMMENT ON COLUMN m_order_rsv_menu.price IS '메뉴 가격 (당시 시점)';
COMMENT ON COLUMN m_order_rsv_menu.cnt IS '수량';

-- ========== t_order ==========
COMMENT ON TABLE t_order IS '주문';
COMMENT ON COLUMN t_order.seq IS 'PK';
COMMENT ON COLUMN t_order.store_seq IS '가게 FK (m_store.seq)';
COMMENT ON COLUMN t_order.rsv_seq IS '예약 FK (t_order_rsv.seq) - 예약 주문일 때만 값 존재';
COMMENT ON COLUMN t_order.amount IS '주문 금액';
COMMENT ON COLUMN t_order.status IS '주문 상태 (READY/COOKED/PAID)';
COMMENT ON COLUMN t_order.order_at IS '주문 시각';
COMMENT ON COLUMN t_order.cooked_at IS '조리 완료 시각';
COMMENT ON COLUMN t_order.cmt IS '비고';
COMMENT ON COLUMN t_order.mod_at IS '수정 시각';

-- ========== t_order_menu ==========
COMMENT ON TABLE t_order_menu IS '주문 메뉴';
COMMENT ON COLUMN t_order_menu.menu_seq IS '메뉴 FK (m_menu.seq)';
COMMENT ON COLUMN t_order_menu.order_seq IS '주문 FK (t_order.seq)';
COMMENT ON COLUMN t_order_menu.price IS '메뉴 가격 (주문 시점)';
COMMENT ON COLUMN t_order_menu.cnt IS '수량';

-- ========== t_order_rsv ==========
COMMENT ON TABLE t_order_rsv IS '예약 주문 인스턴스 (일회성 또는 템플릿 기반 반복)';
COMMENT ON COLUMN t_order_rsv.seq IS 'PK';
COMMENT ON COLUMN t_order_rsv.store_seq IS '가게 FK (m_store.seq)';
COMMENT ON COLUMN t_order_rsv.rsv_tmpl_seq IS '예약 템플릿 FK (m_order_rsv_tmpl.seq) - NULL이면 일회성 예약';
COMMENT ON COLUMN t_order_rsv.amount IS '예약 금액';
COMMENT ON COLUMN t_order_rsv.rsv_at IS '예약 일시';
COMMENT ON COLUMN t_order_rsv.status IS '예약 상태 (RESERVED/COMPLETED/CANCELED)';
COMMENT ON COLUMN t_order_rsv.reg_at IS '등록 시각';
COMMENT ON COLUMN t_order_rsv.mod_at IS '수정 시각';

-- ========== t_order_rsv_menu ==========
COMMENT ON TABLE t_order_rsv_menu IS '예약 주문 메뉴';
COMMENT ON COLUMN t_order_rsv_menu.menu_seq IS '메뉴 FK (m_menu.seq)';
COMMENT ON COLUMN t_order_rsv_menu.rsv_seq IS '예약 FK (t_order_rsv.seq)';
COMMENT ON COLUMN t_order_rsv_menu.price IS '메뉴 가격 (예약 시점)';
COMMENT ON COLUMN t_order_rsv_menu.cnt IS '수량';

-- ========== t_payment ==========
COMMENT ON TABLE t_payment IS '결제';
COMMENT ON COLUMN t_payment.seq IS 'PK';
COMMENT ON COLUMN t_payment.order_seq IS '주문 FK (t_order.seq)';
COMMENT ON COLUMN t_payment.amount IS '결제 금액';
COMMENT ON COLUMN t_payment.pay_type IS '결제 수단 (CASH/CARD)';
COMMENT ON COLUMN t_payment.pay_at IS '결제 시각';

-- ========== t_expense ==========
COMMENT ON TABLE t_expense IS '지출';
COMMENT ON COLUMN t_expense.seq IS 'PK';
COMMENT ON COLUMN t_expense.ctg_seq IS '지출 카테고리 FK (m_expense_category.seq)';
COMMENT ON COLUMN t_expense.store_seq IS '가게 FK (m_store.seq)';
COMMENT ON COLUMN t_expense.nm IS '지출 항목명';
COMMENT ON COLUMN t_expense.amount IS '지출 금액';
COMMENT ON COLUMN t_expense.expense_at IS '지출 시각';
COMMENT ON COLUMN t_expense.cmt IS '비고';
COMMENT ON COLUMN t_expense.options IS '부가 옵션 (JSON)';
COMMENT ON COLUMN t_expense.mod_at IS '수정 시각';

-- ========== t_expense_product ==========
COMMENT ON TABLE t_expense_product IS '지출 제품 상세';
COMMENT ON COLUMN t_expense_product.exps_seq IS '지출 FK (t_expense.seq)';
COMMENT ON COLUMN t_expense_product.prd_seq IS '제품 FK (m_product.seq)';
COMMENT ON COLUMN t_expense_product.cnt IS '수량';
COMMENT ON COLUMN t_expense_product.price IS '가격';
COMMENT ON COLUMN t_expense_product.unit_cnt IS '단위 수량';
COMMENT ON COLUMN t_expense_product.cmt IS '비고';
