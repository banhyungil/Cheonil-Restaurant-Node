import { Payment, initModels } from './init-models'
import { Sequelize } from 'sequelize'
import conifg from '../config/index'
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
const init = async () => {
    const { database, username, password, host, port, dialect } = conifg.database

    let initSequelize = new Sequelize({username, password, host, port, dialect})
    /**
     * @see https://sequelize.org/docs/v6/core-concepts/raw-queries/
     * @example
     * const [results, metadata] = await sequelize.query('UPDATE users SET y = 42 WHERE x = 12');
     */
    const {cnt} = (await initSequelize.query(`SELECT count(*) as cnt
                    FROM INFORMATION_SCHEMA.SCHEMATA
                    WHERE SCHEMA_NAME = '${database}'`, {}))[0][0] as {cnt: number}

    // database가 없는 경우 생성
    if(cnt == 0){
        await initSequelize.query('CREATE DATABASE cheonil;')
        initSequelize = new Sequelize(database, username, password, {
            dialect,
            host,
            port,
        })


        // db 생성
        await (async () => {
            const filePath = path.join(__dirname, '../../resources/db/ddl/db 생성.sql')
            const sql =  readFileSync(filePath, {encoding: 'utf-8'})
            const ddls = sql.split(';')
            for(const ddl of ddls){
                if(ddl.replace(/\s/g, '') == '') return
                await initSequelize.query(ddl)
            }
        })()
        
        await (async () => {
            const filePath = path.join(__dirname, '../../resources/db/ddl/외래키 삭제.sql')
            const sql =  readFileSync(filePath, {encoding: 'utf-8'})
            const ddls = sql.split('\n')
            for(const ddl of ddls){
                if(ddl.replace(/\s/g, '') == '') return
                await initSequelize.query(ddl)
            }
        })()
    
        await (async () => {
            const filePath = path.join(__dirname, '../../resources/db/ddl/외래키 인덱스 생성.sql')
            const sql =  readFileSync(filePath, {encoding: 'utf-8'})
            const ddls = sql.split('\n')
            for(const ddl of ddls){
                if(ddl.replace(/\s/g, '') == '') return
                await initSequelize.query(ddl)
            }
        })()
    }
   
    const sequelize = new Sequelize(database, username, password, {
        dialect,
        host,
        port,
    })

    const models = initModels(sequelize)

    const { MyOrder, OrderMenu, Menu, Store } = models
    MyOrder.hasMany(OrderMenu, { foreignKey: 'orderSeq', as: 'orderMenues' })
    MyOrder.hasMany(Payment, { foreignKey: 'orderSeq', as: 'payments' })
    OrderMenu.belongsTo(MyOrder, { foreignKey: 'orderSeq', as: 'orderMenues' })
    Payment.belongsTo(MyOrder, { foreignKey: 'orderSeq', as: 'payments' })

    MyOrder.belongsTo(Store, { foreignKey: 'storeNm', as: 'store' })
    OrderMenu.belongsTo(Menu, { foreignKey: 'menuNm', as: 'menu' })
    // MenuCategory.hasMany(Menu)
    // StoreCategory.hasMany(Store)

    db.sequelize = sequelize
    db.models = models
}
db.init = init

export default db
