/**
 * pg.erd 파일의 테이블·컬럼 comment 필드를 PostgreSQL에서 조회해 일괄 채움
 * - pg_class / pg_attribute / obj_description / col_description 활용
 * - 이미 채워진 comment는 건드리지 않음
 *
 * 사전 요구:
 *   1. npm install pg @types/pg
 *   2. PG에 DDL + COMMENT ON 문 적용 완료
 *
 * 실행: npx ts-node ./scripts/fill-erd-cmt-pg.ts
 */

import { readFileSync, writeFileSync } from 'fs'
import path from 'path'
import { Client as PgClient } from 'pg'

const ERD_PATH = path.resolve(__dirname, '../pg.erd')

const PG_CONN = {
    host: 'localhost',
    user: 'root',
    port: 5432,
    password: 'root1!',
    database: 'cheonil',
}

const SCHEMA = 'public'

// ===== PG 조회 쿼리 =====
const TABLE_COMMENT_SQL = `
    SELECT c.relname AS table_name,
           obj_description(c.oid, 'pg_class') AS comment
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = $1
      AND c.relkind = 'r';
`

const COLUMN_COMMENT_SQL = `
    SELECT c.relname AS table_name,
           a.attname AS column_name,
           col_description(c.oid, a.attnum) AS comment
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    JOIN pg_attribute a ON a.attrelid = c.oid
    WHERE n.nspname = $1
      AND c.relkind = 'r'
      AND a.attnum > 0
      AND NOT a.attisdropped;
`

// ===== ERD JSON 타입 =====
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

interface ErdRoot {
    collections: {
        tableEntities: Record<string, ErdTable>
        tableColumnEntities: Record<string, ErdColumn>
        [k: string]: unknown
    }
    [k: string]: unknown
}

async function fetchCommentsFromPg() {
    const pg = new PgClient(PG_CONN)
    await pg.connect()
    try {
        const tableRows = (await pg.query<{ table_name: string; comment: string | null }>(
            TABLE_COMMENT_SQL, [SCHEMA],
        )).rows

        const colRows = (await pg.query<{ table_name: string; column_name: string; comment: string | null }>(
            COLUMN_COMMENT_SQL, [SCHEMA],
        )).rows

        const tableMap = new Map<string, string>()
        for (const r of tableRows) {
            if (r.comment) tableMap.set(r.table_name, r.comment)
        }

        const columnMap = new Map<string, string>()
        for (const r of colRows) {
            if (r.comment) columnMap.set(`${r.table_name}.${r.column_name}`, r.comment)
        }

        return { tableMap, columnMap }
    } finally {
        await pg.end()
    }
}

async function main() {
    console.log('▶ PostgreSQL에서 코멘트 조회 중...')
    const { tableMap, columnMap } = await fetchCommentsFromPg()
    console.log(`  ✓ 테이블 코멘트: ${tableMap.size}, 컬럼 코멘트: ${columnMap.size}`)

    if (tableMap.size === 0 && columnMap.size === 0) {
        console.warn('⚠ PG에서 조회된 코멘트가 없습니다. DDL의 COMMENT ON 적용 여부를 확인하세요.')
        return
    }

    console.log('\n▶ pg.erd 파일 읽는 중...')
    const raw = readFileSync(ERD_PATH, 'utf-8')
    const root = JSON.parse(raw) as ErdRoot

    const tables = root.collections?.tableEntities
    const columns = root.collections?.tableColumnEntities
    if (!tables || !columns) {
        throw new Error('pg.erd 구조를 찾을 수 없음 (collections.tableEntities / tableColumnEntities)')
    }

    const tableIdToName = new Map<string, string>()
    let tableUpdated = 0
    let tableSkipped = 0
    let columnUpdated = 0
    let columnSkipped = 0
    const missing: string[] = []

    // 1. 테이블 코멘트
    for (const t of Object.values(tables)) {
        tableIdToName.set(t.id, t.name)
        const desired = tableMap.get(t.name)
        if (!desired) continue
        if (t.comment && t.comment.trim() !== '') {
            tableSkipped++
            continue
        }
        t.comment = desired
        tableUpdated++
    }

    // 2. 컬럼 코멘트
    for (const c of Object.values(columns)) {
        const tableName = tableIdToName.get(c.tableId)
        if (!tableName) continue
        const key = `${tableName}.${c.name}`
        const desired = columnMap.get(key)
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

    console.log('\n========== 결과 ==========')
    console.log(`테이블: ${tableUpdated}개 추가, ${tableSkipped}개 건너뜀 (기존값 보존)`)
    console.log(`컬럼: ${columnUpdated}개 추가, ${columnSkipped}개 건너뜀 (기존값 보존)`)
    if (missing.length > 0) {
        console.log(`\nPG에 코멘트 없음 (${missing.length}):`)
        missing.forEach((m) => console.log('  - ' + m))
    }
}

main().catch((e) => {
    console.error(e)
    process.exit(1)
})
