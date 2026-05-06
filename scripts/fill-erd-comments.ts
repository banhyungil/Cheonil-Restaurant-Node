/**
 * pg.erd 파일의 테이블·컬럼 comment 필드 일괄 채우기
 * - ddl-pg-comments.sql 기반 매핑
 * - 이미 채워진 comment는 건드리지 않음
 *
 * 실행: npx ts-node ./scripts/fill-erd-comments.ts
 */

import { readFileSync, writeFileSync } from 'fs'
import path from 'path'

const ERD_PATH = path.resolve(__dirname, '../pg.erd')

// ===== 테이블 코멘트 =====
const tableComments: Record<string, string> = {
    m_setting: '시스템 전역 설정',
    m_store_category: '가게 카테고리',
    m_store: '가게 (지점)',
    m_menu_category: '메뉴 카테고리',
    m_menu: '메뉴',
    m_expense_category: '지출 카테고리 (ltree 계층 구조)',
    m_ingredient: '식자재 / 원재료',
    m_product_info: '제품 정보 (식자재의 상품 정보)',
    m_unit: '단위 (kg, 박스, 개 등)',
    m_product: '제품 (제품 정보 + 단위 조합)',
    m_order_rsv_tmpl: '예약 주문 템플릿 (단골 반복 예약)',
    m_order_rsv_menu: '예약 템플릿 메뉴 (단골이 고정적으로 주문하는 메뉴)',
    t_order: '주문',
    t_order_menu: '주문 메뉴',
    t_order_rsv: '예약 주문 인스턴스 (일회성 또는 템플릿 기반 반복)',
    t_order_rsv_menu: '예약 주문 메뉴',
    t_payment: '결제',
    t_expense: '지출',
    t_expense_product: '지출 제품 상세',
}

// ===== 컬럼 코멘트 (테이블명.컬럼명 → 설명) =====
const columnComments: Record<string, string> = {
    // m_setting
    'm_setting.seq': 'PK',
    'm_setting.config': '설정 값 (JSON)',

    // m_store_category
    'm_store_category.seq': 'PK',
    'm_store_category.nm': '카테고리명',
    'm_store_category.options': '부가 옵션 (JSON)',
    'm_store_category.reg_at': '등록 시각',
    'm_store_category.mod_at': '수정 시각',

    // m_store
    'm_store.seq': 'PK',
    'm_store.ctg_seq': '가게 카테고리 FK (m_store_category.seq)',
    'm_store.nm': '가게명',
    'm_store.addr': '주소',
    'm_store.cmt': '비고',
    'm_store.latitude': '위도',
    'm_store.longitude': '경도',
    'm_store.options': '부가 옵션 (JSON)',
    'm_store.reg_at': '등록 시각',
    'm_store.mod_at': '수정 시각',

    // m_menu_category
    'm_menu_category.seq': 'PK',
    'm_menu_category.nm': '카테고리명',
    'm_menu_category.options': '부가 옵션 (JSON)',
    'm_menu_category.reg_at': '등록 시각',
    'm_menu_category.mod_at': '수정 시각',

    // m_menu
    'm_menu.seq': 'PK',
    'm_menu.ctg_seq': '메뉴 카테고리 FK (m_menu_category.seq)',
    'm_menu.nm': '메뉴명',
    'm_menu.nm_s': '짧은 이름 / 약칭',
    'm_menu.price': '가격 (원)',
    'm_menu.cmt': '비고',
    'm_menu.options': '부가 옵션 (JSON)',
    'm_menu.reg_at': '등록 시각',
    'm_menu.mod_at': '수정 시각',

    // m_expense_category
    'm_expense_category.seq': 'PK',
    'm_expense_category.path': '계층 경로 (예: food.meat.beef)',
    'm_expense_category.nm': '카테고리명',
    'm_expense_category.options': '부가 옵션 (JSON)',

    // m_ingredient
    'm_ingredient.seq': 'PK',
    'm_ingredient.nm': '식자재명',
    'm_ingredient.options': '부가 옵션 (JSON)',
    'm_ingredient.reg_at': '등록 시각',
    'm_ingredient.mod_at': '수정 시각',

    // m_product_info
    'm_product_info.seq': 'PK',
    'm_product_info.ingd_seq': '식자재 FK (m_ingredient.seq)',
    'm_product_info.nm': '제품명',
    'm_product_info.cmt': '비고',
    'm_product_info.options': '부가 옵션 (JSON)',
    'm_product_info.reg_at': '등록 시각',
    'm_product_info.mod_at': '수정 시각',

    // m_unit
    'm_unit.seq': 'PK',
    'm_unit.nm': '단위명',
    'm_unit.is_unit_cnt': '단위 수량 사용 여부',

    // m_product
    'm_product.seq': 'PK',
    'm_product.prd_info_seq': '제품 정보 FK (m_product_info.seq)',
    'm_product.unit_seq': '단위 FK (m_unit.seq)',
    'm_product.unit_cnts': '단위별 수량 옵션 배열 (예: {1, 5, 10})',

    // m_order_rsv_tmpl
    'm_order_rsv_tmpl.seq': 'PK',
    'm_order_rsv_tmpl.store_seq': '가게 FK (m_store.seq)',
    'm_order_rsv_tmpl.nm': '템플릿명 (단골 식별용)',
    'm_order_rsv_tmpl.amount': '예약 금액',
    'm_order_rsv_tmpl.rsv_time': '예약 시각 (HH:MM)',
    'm_order_rsv_tmpl.day_types': '반복 요일 배열 (예: {MON, WED, FRI})',
    'm_order_rsv_tmpl.cmt': '비고',
    'm_order_rsv_tmpl.active': '활성 여부 (false면 반복 중단)',
    'm_order_rsv_tmpl.start_dt': '패턴 시작일',
    'm_order_rsv_tmpl.end_dt': '패턴 종료일 (무기한이면 NULL)',
    'm_order_rsv_tmpl.options': '부가 옵션 (JSON)',
    'm_order_rsv_tmpl.reg_at': '등록 시각',
    'm_order_rsv_tmpl.mod_at': '수정 시각',

    // m_order_rsv_menu
    'm_order_rsv_menu.menu_seq': '메뉴 FK (m_menu.seq)',
    'm_order_rsv_menu.rsv_tmpl_seq': '예약 템플릿 FK (m_order_rsv_tmpl.seq)',
    'm_order_rsv_menu.price': '메뉴 가격 (당시 시점)',
    'm_order_rsv_menu.cnt': '수량',

    // t_order
    't_order.seq': 'PK',
    't_order.store_seq': '가게 FK (m_store.seq)',
    't_order.rsv_seq': '예약 FK (t_order_rsv.seq) - 예약 주문일 때만 값 존재',
    't_order.amount': '주문 금액',
    't_order.status': '주문 상태 (READY/COOKED/PAID)',
    't_order.order_at': '주문 시각',
    't_order.cooked_at': '조리 완료 시각',
    't_order.cmt': '비고',
    't_order.mod_at': '수정 시각',

    // t_order_menu
    't_order_menu.menu_seq': '메뉴 FK (m_menu.seq)',
    't_order_menu.order_seq': '주문 FK (t_order.seq)',
    't_order_menu.price': '메뉴 가격 (주문 시점)',
    't_order_menu.cnt': '수량',

    // t_order_rsv
    't_order_rsv.seq': 'PK',
    't_order_rsv.store_seq': '가게 FK (m_store.seq)',
    't_order_rsv.rsv_tmpl_seq': '예약 템플릿 FK (m_order_rsv_tmpl.seq) - NULL이면 일회성 예약',
    't_order_rsv.amount': '예약 금액',
    't_order_rsv.rsv_at': '예약 일시',
    't_order_rsv.status': '예약 상태 (RESERVED/COMPLETED/CANCELED)',
    't_order_rsv.reg_at': '등록 시각',
    't_order_rsv.mod_at': '수정 시각',

    // t_order_rsv_menu
    't_order_rsv_menu.menu_seq': '메뉴 FK (m_menu.seq)',
    't_order_rsv_menu.rsv_seq': '예약 FK (t_order_rsv.seq)',
    't_order_rsv_menu.price': '메뉴 가격 (예약 시점)',
    't_order_rsv_menu.cnt': '수량',

    // t_payment
    't_payment.seq': 'PK',
    't_payment.order_seq': '주문 FK (t_order.seq)',
    't_payment.amount': '결제 금액',
    't_payment.pay_type': '결제 수단 (CASH/CARD)',
    't_payment.pay_at': '결제 시각',

    // t_expense
    't_expense.seq': 'PK',
    't_expense.ctg_seq': '지출 카테고리 FK (m_expense_category.seq)',
    't_expense.store_seq': '가게 FK (m_store.seq)',
    't_expense.nm': '지출 항목명',
    't_expense.amount': '지출 금액',
    't_expense.expense_at': '지출 시각',
    't_expense.cmt': '비고',
    't_expense.options': '부가 옵션 (JSON)',
    't_expense.mod_at': '수정 시각',

    // t_expense_product
    't_expense_product.exps_seq': '지출 FK (t_expense.seq)',
    't_expense_product.prd_seq': '제품 FK (m_product.seq)',
    't_expense_product.cnt': '수량',
    't_expense_product.price': '가격',
    't_expense_product.unit_cnt': '단위 수량',
    't_expense_product.cmt': '비고',
}

interface ErdTable {
    id: string
    name: string
    comment: string
    columnIds: string[]
}

interface ErdColumn {
    id: string
    tableId: string
    name: string
    comment: string
}

type ErdEntities = {
    tableEntities: Record<string, ErdTable>
    tableColumnEntities: Record<string, ErdColumn>
}

interface ErdRoot {
    collections: ErdEntities & Record<string, unknown>
    [k: string]: unknown
}

function main() {
    const raw = readFileSync(ERD_PATH, 'utf-8')
    const root = JSON.parse(raw) as ErdRoot

    const tables = root.collections.tableEntities
    const columns = root.collections.tableColumnEntities

    if (!tables || !columns) {
        throw new Error('pg.erd 구조를 찾을 수 없음 (collections.tableEntities / tableColumnEntities)')
    }

    const tableIdToName = new Map<string, string>()
    let tableUpdated = 0
    let columnUpdated = 0
    let columnSkipped = 0
    const missing: string[] = []

    // 1. 테이블 코멘트
    for (const t of Object.values(tables)) {
        tableIdToName.set(t.id, t.name)
        const desired = tableComments[t.name]
        if (!desired) continue
        if (t.comment && t.comment.trim() !== '') continue   // 이미 값 있으면 건드리지 않음
        t.comment = desired
        tableUpdated++
    }

    // 2. 컬럼 코멘트
    for (const c of Object.values(columns)) {
        const tableName = tableIdToName.get(c.tableId)
        if (!tableName) continue
        const key = `${tableName}.${c.name}`
        const desired = columnComments[key]
        if (!desired) {
            missing.push(key)
            continue
        }
        if (c.comment && c.comment.trim() !== '') {
            columnSkipped++
            continue
        }
        c.comment = desired
        columnUpdated++
    }

    writeFileSync(ERD_PATH, JSON.stringify(root, null, 2), 'utf-8')

    console.log(`테이블 코멘트 추가: ${tableUpdated}`)
    console.log(`컬럼 코멘트 추가: ${columnUpdated}`)
    console.log(`컬럼 건너뜀 (이미 입력됨): ${columnSkipped}`)
    if (missing.length > 0) {
        console.log(`\n매핑 누락 (${missing.length}):`)
        missing.forEach((m) => console.log('  - ' + m))
    }
}

main()
