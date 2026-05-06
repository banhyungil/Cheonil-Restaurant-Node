# 컬럼 약어 매핑

| 약어 | 풀네임 | 설명 |
|------|--------|------|
| seq | sequence | 시퀀스 (PK) |
| nm | name | 이름 |
| nm_s | name_short | 짧은 이름 / 약칭 |
| addr | address | 주소 |
| ctg | category | 카테고리 |
| tmpl | template | 템플릿 |
| ingd | ingredient | 식자재 / 원재료 |
| prd | product | 제품 |
| exps | expense | 지출 |
| cmt | comment | 비고 |
| rsv | reservation | 예약 |
| cnt | count | 수량 |
| dt | date | 날짜 (DATE 타입) |
| reg | register / registered | 등록 (생성 시점) |
| mod | modify / modified | 수정 (갱신 시점) |

## 컬럼별 매핑

| 약어 컬럼명 | 풀네임 | 사용 테이블 |
|-------------|--------|------------|
| nm | name | m_store_category, m_store, m_menu_category, m_menu, m_ingredient, m_product_info, m_unit, m_order_rsv_tmpl, t_expense |
| nm_s | name_short | m_menu |
| addr | address | m_store |
| ctg_seq | category_seq | m_store, m_menu, t_expense |
| ingd_seq | ingredient_seq | m_product_info |
| prd_info_seq | product_info_seq | m_product |
| prd_seq | product_seq | t_expense_product |
| exps_seq | expense_seq | t_expense_product |
| rsv_seq | reservation_seq | t_order, t_order_rsv_menu |
| rsv_tmpl_seq | reservation_template_seq | m_order_rsv_menu, t_order_rsv |
| rsv_at | reservation_at | t_order_rsv |
| rsv_time | reservation_time | m_order_rsv_tmpl |
| start_dt | start_date | m_order_rsv_tmpl |
| end_dt | end_date | m_order_rsv_tmpl |
| cmt | comment | m_store, m_menu, m_product_info, m_order_rsv_tmpl, t_order, t_expense, t_expense_product |
| cnt | count | m_order_rsv_menu, t_order_menu, t_order_rsv_menu, t_expense_product |
| unit_cnt | unit_count | m_unit, m_product, t_expense_product |
| reg_at | registered_at | 전체 마스터 테이블, t_order_rsv |
| mod_at | modified_at | 전체 마스터 테이블, t_order, t_order_rsv, t_expense |
