import { readFileSync } from 'fs'
import path from 'path'
import mysql from 'mysql2/promise'

const DUMP_PATH = path.resolve(__dirname, './dump.sql')
const BATCH_SIZE = 500

const CONNECTION = {
    host: 'localhost',
    user: 'root',
    port: 3306,
    password: 'nice2122!',
    database: 'cheonil',
    multipleStatements: true,
}

type Group = { prefix: string; values: string[] }

function parseDump(sql: string): Group[] {
    const groups = new Map<string, Group>()
    const re = /INSERT INTO\s+(`[^`]+`\s*\([^)]+\))\s*VALUES\s*(\([\s\S]*?\));/g
    let m: RegExpExecArray | null
    while ((m = re.exec(sql)) !== null) {
        const prefix = `INSERT INTO ${m[1]} VALUES`
        const value = m[2]
        if (!groups.has(prefix)) groups.set(prefix, { prefix, values: [] })
        groups.get(prefix)!.values.push(value)
    }
    return [...groups.values()]
}

async function init() {
    const sql = readFileSync(DUMP_PATH, 'utf-8')
    const groups = parseDump(sql)
    const totalRows = groups.reduce((s, g) => s + g.values.length, 0)
    console.log(`parsed: ${groups.length} tables, ${totalRows} rows`)

    const conn = await mysql.createConnection(CONNECTION)
    try {
        await conn.query('SET foreign_key_checks=0; SET unique_checks=0; SET autocommit=0;')
        await conn.beginTransaction()

        const start = Date.now()
        for (const g of groups) {
            for (let i = 0; i < g.values.length; i += BATCH_SIZE) {
                const chunk = g.values.slice(i, i + BATCH_SIZE)
                await conn.query(`${g.prefix} ${chunk.join(',')};`)
            }
            console.log(`  inserted ${g.values.length} rows -> ${g.prefix.match(/`[^`]+`/)![0]}`)
        }

        await conn.commit()
        await conn.query('SET foreign_key_checks=1; SET unique_checks=1; SET autocommit=1;')
        console.log(`done in ${((Date.now() - start) / 1000).toFixed(2)}s`)
    } catch (e) {
        await conn.rollback()
        throw e
    } finally {
        await conn.end()
    }
}

init().catch((e) => {
    console.error(e)
    process.exit(1)
})
