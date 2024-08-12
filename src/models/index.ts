import { initModels } from './init-models'
import { Sequelize } from 'sequelize'
import conifg from '../config'
import cls from 'cls-hooked'
import path from 'path'
import { readFileSync } from 'fs'

const namespace = cls.createNamespace('cheonil')
Sequelize.useCLS(namespace)

const db = {} as {
    init: () => void
    sequelize: Sequelize
    models: ReturnType<typeof initModels>
}

const { database, username, password, host, port, dialect } = conifg.database

const sequelize = new Sequelize(database, username, password, {
    dialect,
    host,
    port,
})

const models = initModels(sequelize)

const { MyOrder, OrderMenu, Menu, Store, Payment } = models
MyOrder.hasMany(OrderMenu, { foreignKey: 'orderSeq', as: 'orderMenues' })
MyOrder.hasMany(Payment, { foreignKey: 'orderSeq', as: 'payments' })
OrderMenu.belongsTo(MyOrder, { foreignKey: 'orderSeq', as: 'orderMenues' })
Payment.belongsTo(MyOrder, { foreignKey: 'orderSeq', as: 'payments' })

MyOrder.belongsTo(Store, { foreignKey: 'storeSeq', as: 'store' })
OrderMenu.belongsTo(Menu, { foreignKey: 'menuSeq', as: 'menu' })
// MenuCategory.hasMany(Menu)
// StoreCategory.hasMany(Store)

db.sequelize = sequelize
db.models = models
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
                                        WHERE TABLE_SCHEMA = '${database}'
                                        AND TABLE_NAME = 'MyOrder';`,
                {},
            )
        )[0][0] as { cnt: number }

    // database가 없는 경우 생성
    if (cnt == 0) {
        // db 생성
        await (async () => {
            const filePath = path.join(__dirname, '../resources/db/ddl/db 생성.sql')
            const sql = readFileSync(filePath, { encoding: 'utf-8' })
            const ddls = sql.split(';')
            for (const ddl of ddls) {
                if (ddl.replace(/\s/g, '') == '') return
                await sequelize.query(ddl)
            }
        })()

        await (async () => {
            const filePath = path.join(__dirname, '../resources/db/ddl/외래키 삭제.sql')
            const sql = readFileSync(filePath, { encoding: 'utf-8' })
            const ddls = sql.split('\n')
            for (const ddl of ddls) {
                if (ddl.replace(/\s/g, '') == '') return
                await sequelize.query(ddl)
            }
        })()
    }
}

export default db
