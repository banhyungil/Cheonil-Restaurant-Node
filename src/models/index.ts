import { initModels } from './init-models.ts'
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
    Order.hasMany(OrderMenu, { foreignKey: 'orderId', as: 'orderMenues' })
    OrderMenu.belongsTo(Order, { foreignKey: 'orderId', as: 'orderMenues' })
    // Store.hasMany(Order, { foreignKey: 'storeId' })
    Order.belongsTo(Store, { foreignKey: 'storeName', as: 'store' })
    // Menu.hasMany(OrderMenu, { foreignKey: 'menuId' })
    OrderMenu.belongsTo(Menu, { foreignKey: 'menuName', as: 'menu' })
    // MenuCategory.hasMany(Menu)
    // StoreCategory.hasMany(Store)

    db.sequelize = sequelize
    db.models = models
}
db.init = init

export default db
