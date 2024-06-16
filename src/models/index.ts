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

    const { TOrder, TOrderMenu, Menu, Store } = models
    TOrder.hasMany(TOrderMenu, { foreignKey: 'orderId', as: 'orderMenues' })
    TOrderMenu.belongsTo(TOrder, { foreignKey: 'orderId', as: 'orderMenues' })
    // Store.hasMany(TOrder, { foreignKey: 'storeId' })
    TOrder.belongsTo(Store, { foreignKey: 'storeId', as: 'store' })
    // Menu.hasMany(TOrderMenu, { foreignKey: 'menuId' })
    TOrderMenu.belongsTo(Menu, { foreignKey: 'menuId', as: 'menu' })
    // MenuCategory.hasMany(Menu)
    // StoreCategory.hasMany(Store)

    db.sequelize = sequelize
    db.models = models
}
db.init = init

export default db
