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
