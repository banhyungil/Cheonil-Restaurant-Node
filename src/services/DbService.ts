import _ from 'lodash'
import { readdirSync, readFileSync } from 'fs'
import logger from 'jet-logger'
import config from '@src/config'
import { Models, sequelize } from '@src/models'
import path from 'path'
import dbChanges from '@src/resources/db/dbChanges'

async function init() {
    if (await existDb()) {
        await applyChanges()
    } else {
        await initDb()
    }
}

async function existDb() {
    const { cnt } = (
        await sequelize.query(
            `SELECT COUNT(*) as cnt
                 FROM INFORMATION_SCHEMA.TABLES
                 WHERE TABLE_SCHEMA = '${config.db.database}';`,
            {},
        )
    )[0][0] as { cnt: number }

    return cnt > 0
}

async function initDb() {
    // 1. DB 생성
    await (async () => {
        const filePath = path.join(__dirname, '../resources/db/ddl/db 생성.sql')
        const sql = readFileSync(filePath, { encoding: 'utf-8' })
        const ddls = sql.split(';')
        for (const ddl of ddls) {
            if (ddl.replace(/\s/g, '') == '') return
            await sequelize.query(ddl)
        }
    })()

    // 2. 초기 데이터 생성
    const latestDbVersion = (() => {
        const dirPath = path.join(__dirname, '../resources/db/changes')
        const files = readdirSync(dirPath)
        return (
            files
                .filter((file) => file.includes('.sql'))
                .sort()
                .pop()
                ?.replace('.sql', '') ?? '1.0.0'
        )
    })()
    await Models.Setting.create({ config: { dbVersion: latestDbVersion } })
}

async function applyChanges() {
    await sequelize.transaction(async () => {
        const dbSetting = await Models.Setting.findOne()
        if (dbSetting == null || dbSetting.config == null) throw new Error('not possible')

        const curDbVersion = dbSetting.config.dbVersion
        // 현재 버전 보다 높은 변경 사항 추출
        const targetChanges = _.sortBy(
            dbChanges.filter((item) => item.version > curDbVersion),
            (item) => item.version,
        )
        if (targetChanges.length == 0) {
            logger.info('No Changes To DB')
            return
        }

        // 변경사항 순차 적용
        for (const item of targetChanges) {
            // await sequelize.transaction(async () => {
            const filePath = path.join(__dirname, `../resources/db/changes/${item.version}.sql`)
            const sqlStr = readFileSync(filePath, { encoding: 'utf-8' })
            const sqls = sqlStr.split(';')
            for (const sql of sqls) {
                if (sql.replace(/\s/g, '') == '') continue
                await sequelize.query(sql)
            }
            // })
        }

        // 버전 정보 업데이트
        const latestVersion = targetChanges[targetChanges.length - 1].version
        await dbSetting.update({ config: { ...dbSetting.config, dbVersion: latestVersion } })
        await dbSetting.save()
    })
}

export default { init, existDb, initDb, applyChanges }
