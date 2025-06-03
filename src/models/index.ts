import { initModels } from './init-models'
import { Sequelize } from 'sequelize'
import conifg from '../config'
import cls from 'cls-hooked'

const namespace = cls.createNamespace('cheonil')
Sequelize.useCLS(namespace)

const { database, username, password, host, port, dialect, timezone } = conifg.db

const sequelize = new Sequelize(database, username, password, {
    dialect,
    host,
    port,
    timezone,
})

const Models = initModels(sequelize)

const { MyOrder, OrderMenu, Menu, Store, Payment, ProductInfo, Supply, Expense, Unit, Product, ExpenseProduct, ExpenseCategory } = Models
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

Product.belongsTo(ProductInfo, { foreignKey: 'prdInfoSeq', as: 'prdInfo' })
Product.belongsTo(Unit, { foreignKey: 'unitSeq', as: 'unit' })

Expense.hasMany(ExpenseProduct, { foreignKey: 'expsSeq', as: 'expsPrds' })
Expense.belongsTo(Store, { foreignKey: 'storeSeq', as: 'store' })
Expense.belongsTo(ExpenseCategory, { foreignKey: 'ctgSeq', as: 'category' })
ExpenseProduct.belongsTo(Product, { foreignKey: 'prdSeq', as: 'product' })

export { sequelize, Models }
