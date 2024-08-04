import { Payment, initModels } from './init-models.ts'
import { Sequelize } from 'sequelize'
import conifg from '../config/index.ts'
import cls from 'cls-hooked'

const namespace = cls.createNamespace('cheonil')
Sequelize.useCLS(namespace)

const db = {} as {
    init: () => void
    sequelize: Sequelize
    models: ReturnType<typeof initModels>
}
const init = () => {
    const { database, user, password, host, port } = conifg.mysql
    const sequelize = new Sequelize(database, user, password, {
        dialect: 'mysql',
        host,
        port,
    })

    const models = initModels(sequelize)

    const { Order, OrderMenu, Menu, Store } = models
    Order.hasMany(OrderMenu, { foreignKey: 'orderSeq', as: 'orderMenues' })
    Order.hasMany(Payment, { foreignKey: 'orderSeq', as: 'payments' })
    OrderMenu.belongsTo(Order, { foreignKey: 'orderSeq', as: 'orderMenues' })
    Payment.belongsTo(Order, { foreignKey: 'orderSeq', as: 'payments' })

    Order.belongsTo(Store, { foreignKey: 'storeNm', as: 'store' })
    OrderMenu.belongsTo(Menu, { foreignKey: 'menuNm', as: 'menu' })
    // MenuCategory.hasMany(Menu)
    // StoreCategory.hasMany(Store)

    db.sequelize = sequelize
    db.models = models
}
db.init = init

export default db
