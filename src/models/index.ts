import { initModels } from './init-models'
import { Sequelize } from 'sequelize'
import conifg from '../config'
import cls from 'cls-hooked'
import path from 'path'
import { readdirSync, readFileSync } from 'fs'
import logger from 'jet-logger'
import _ from 'lodash'
import dbChanges from '@src/resources/db/dbChanges'

const namespace = cls.createNamespace('cheonil')
Sequelize.useCLS(namespace)

const db = {} as {
    init: () => void
    sequelize: Sequelize
    Models: ReturnType<typeof initModels>
}

const { database, username, password, host, port, dialect, timezone } = conifg.database

const sequelize = new Sequelize(database, username, password, {
    dialect,
    host,
    port,
    timezone,
})

const Models = initModels(sequelize)

const { MyOrder, OrderMenu, Menu, Store, Payment, ProductInfo, Supply, Expense, Unit, Product } = Models
MyOrder.hasMany(OrderMenu, { foreignKey: 'orderSeq', as: 'orderMenues' })
MyOrder.hasMany(Payment, { foreignKey: 'orderSeq', as: 'payments' })
OrderMenu.belongsTo(MyOrder, { foreignKey: 'orderSeq', as: 'orderMenues' })
Payment.belongsTo(MyOrder, { foreignKey: 'orderSeq', as: 'payments' })

MyOrder.belongsTo(Store, { foreignKey: 'storeSeq', as: 'store' })
OrderMenu.belongsTo(Menu, { foreignKey: 'menuSeq', as: 'menu' })

ProductInfo.belongsTo(Supply, { foreignKey: 'suplSeq', as: 'supply' })
Supply.hasMany(ProductInfo, { foreignKey: 'suplSeq', as: 'product' })

ProductInfo.hasMany(Product, { foreignKey: 'prdInfoSeq', as: 'products' })
ProductInfo.belongsToMany(Unit, { foreignKey: 'prdInfoSeq', as: 'units', through: 'Product' })
Unit.belongsToMany(ProductInfo, { foreignKey: 'unitSeq', as: 'products', through: 'Product' })

Product.belongsTo(ProductInfo, { foreignKey: 'prdInfoSeq', as: 'product' })
Product.belongsTo(Unit, { foreignKey: 'unitSeq', as: 'unit' })

Expense.belongsTo(Product, { foreignKey: 'prdSeq', as: 'product' })
Expense.belongsTo(Product, { foreignKey: 'unitSeq', as: 'unit' })
Expense.belongsTo(Store, { foreignKey: 'storeSeq', as: 'store' })
// MenuCategory.hasMany(Menu)
// StoreCategory.hasMany(Store)

db.sequelize = sequelize
db.Models = Models

db.init = async () => {
    const { cnt } =
        /**
         * @see https://sequelize.org/docs/v6/core-concepts/raw-queries/
         * @example
         * const [results, metadata] = await sequelize.query('UPDATE users SET y = 42 WHERE x = 12');
         */
        (
            await sequelize.query(
                `SELECT COUNT(*) as cnt
                 FROM INFORMATION_SCHEMA.TABLES
                 WHERE TABLE_SCHEMA = '${database}';`,
                {},
            )
        )[0][0] as { cnt: number }

    // database가 없는 경우 생성
    if (cnt == 0) {
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

    try {
        await sequelize.transaction(async () => {
            const dbSetting = await Models.Setting.findOne()
            if (dbSetting == null || dbSetting.config == null) throw new Error('not possible')

            const curDbVersion = dbSetting.config.dbVersion
            // 현재 버전 보다 높은 변경 사항 추출
            const applyChanges = _.sortBy(
                dbChanges.filter((item) => item.version > curDbVersion),
                (item) => item.version,
            )
            if (applyChanges.length == 0) {
                logger.info('No Changes To DB')
                return
            }

            // 변경사항 순차 적용
            for (const item of applyChanges) {
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
            const latestVersion = applyChanges[applyChanges.length - 1].version
            await dbSetting.update({ config: { ...dbSetting.config, dbVersion: latestVersion } })
            await dbSetting.save()
        })
    } catch (error) {
        logger.err(error)
    }
}

export default db
