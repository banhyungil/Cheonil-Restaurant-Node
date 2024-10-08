import type { Sequelize } from 'sequelize'
import { Expense as _Expense } from './Expense'
import type { ExpenseAttributes, ExpenseCreationAttributes } from './Expense'
import { MapProductUnit as _MapProductUnit } from './MapProductUnit'
import type { MapProductUnitAttributes, MapProductUnitCreationAttributes } from './MapProductUnit'
import { MapSupplyUnit as _MapSupplyUnit } from './MapSupplyUnit'
import type { MapSupplyUnitAttributes, MapSupplyUnitCreationAttributes } from './MapSupplyUnit'
import { Menu as _Menu } from './Menu'
import type { MenuAttributes, MenuCreationAttributes } from './Menu'
import { MenuCategory as _MenuCategory } from './MenuCategory'
import type { MenuCategoryAttributes, MenuCategoryCreationAttributes } from './MenuCategory'
import { MyOrder as _MyOrder } from './MyOrder'
import type { MyOrderAttributes, MyOrderCreationAttributes } from './MyOrder'
import { OrderMenu as _OrderMenu } from './OrderMenu'
import type { OrderMenuAttributes, OrderMenuCreationAttributes } from './OrderMenu'
import { OrderMenuRsv as _OrderMenuRsv } from './OrderMenuRsv'
import type { OrderMenuRsvAttributes, OrderMenuRsvCreationAttributes } from './OrderMenuRsv'
import { OrderRsv as _OrderRsv } from './OrderRsv'
import type { OrderRsvAttributes, OrderRsvCreationAttributes } from './OrderRsv'
import { Payment as _Payment } from './Payment'
import type { PaymentAttributes, PaymentCreationAttributes } from './Payment'
import { PlaceCategory as _PlaceCategory } from './PlaceCategory'
import type { PlaceCategoryAttributes, PlaceCategoryCreationAttributes } from './PlaceCategory'
import { Product as _Product } from './Product'
import type { ProductAttributes, ProductCreationAttributes } from './Product'
import { Setting as _Setting } from './Setting'
import type { SettingAttributes, SettingCreationAttributes } from './Setting'
import { Store as _Store } from './Store'
import type { StoreAttributes, StoreCreationAttributes } from './Store'
import { StoreCategory as _StoreCategory } from './StoreCategory'
import type { StoreCategoryAttributes, StoreCategoryCreationAttributes } from './StoreCategory'
import { StoreExpenseLog as _StoreExpenseLog } from './StoreExpenseLog'
import type { StoreExpenseLogAttributes, StoreExpenseLogCreationAttributes } from './StoreExpenseLog'
import { Supply as _Supply } from './Supply'
import type { SupplyAttributes, SupplyCreationAttributes } from './Supply'
import { Unit as _Unit } from './Unit'
import type { UnitAttributes, UnitCreationAttributes } from './Unit'

export {
    _Expense as Expense,
    _MapProductUnit as MapProductUnit,
    _MapSupplyUnit as MapSupplyUnit,
    _Menu as Menu,
    _MenuCategory as MenuCategory,
    _MyOrder as MyOrder,
    _OrderMenu as OrderMenu,
    _OrderMenuRsv as OrderMenuRsv,
    _OrderRsv as OrderRsv,
    _Payment as Payment,
    _PlaceCategory as PlaceCategory,
    _Product as Product,
    _Setting as Setting,
    _Store as Store,
    _StoreCategory as StoreCategory,
    _StoreExpenseLog as StoreExpenseLog,
    _Supply as Supply,
    _Unit as Unit,
}

export type {
    ExpenseAttributes,
    ExpenseCreationAttributes,
    MapProductUnitAttributes,
    MapProductUnitCreationAttributes,
    MapSupplyUnitAttributes,
    MapSupplyUnitCreationAttributes,
    MenuAttributes,
    MenuCreationAttributes,
    MenuCategoryAttributes,
    MenuCategoryCreationAttributes,
    MyOrderAttributes,
    MyOrderCreationAttributes,
    OrderMenuAttributes,
    OrderMenuCreationAttributes,
    OrderMenuRsvAttributes,
    OrderMenuRsvCreationAttributes,
    OrderRsvAttributes,
    OrderRsvCreationAttributes,
    PaymentAttributes,
    PaymentCreationAttributes,
    PlaceCategoryAttributes,
    PlaceCategoryCreationAttributes,
    ProductAttributes,
    ProductCreationAttributes,
    SettingAttributes,
    SettingCreationAttributes,
    StoreAttributes,
    StoreCreationAttributes,
    StoreCategoryAttributes,
    StoreCategoryCreationAttributes,
    StoreExpenseLogAttributes,
    StoreExpenseLogCreationAttributes,
    SupplyAttributes,
    SupplyCreationAttributes,
    UnitAttributes,
    UnitCreationAttributes,
}

export function initModels(sequelize: Sequelize) {
    const Expense = _Expense.initModel(sequelize)
    const MapProductUnit = _MapProductUnit.initModel(sequelize)
    const MapSupplyUnit = _MapSupplyUnit.initModel(sequelize)
    const Menu = _Menu.initModel(sequelize)
    const MenuCategory = _MenuCategory.initModel(sequelize)
    const MyOrder = _MyOrder.initModel(sequelize)
    const OrderMenu = _OrderMenu.initModel(sequelize)
    const OrderMenuRsv = _OrderMenuRsv.initModel(sequelize)
    const OrderRsv = _OrderRsv.initModel(sequelize)
    const Payment = _Payment.initModel(sequelize)
    const PlaceCategory = _PlaceCategory.initModel(sequelize)
    const Product = _Product.initModel(sequelize)
    const Setting = _Setting.initModel(sequelize)
    const Store = _Store.initModel(sequelize)
    const StoreCategory = _StoreCategory.initModel(sequelize)
    const StoreExpenseLog = _StoreExpenseLog.initModel(sequelize)
    const Supply = _Supply.initModel(sequelize)
    const Unit = _Unit.initModel(sequelize)

    return {
        Expense: Expense,
        MapProductUnit: MapProductUnit,
        MapSupplyUnit: MapSupplyUnit,
        Menu: Menu,
        MenuCategory: MenuCategory,
        MyOrder: MyOrder,
        OrderMenu: OrderMenu,
        OrderMenuRsv: OrderMenuRsv,
        OrderRsv: OrderRsv,
        Payment: Payment,
        PlaceCategory: PlaceCategory,
        Product: Product,
        Setting: Setting,
        Store: Store,
        StoreCategory: StoreCategory,
        StoreExpenseLog: StoreExpenseLog,
        Supply: Supply,
        Unit: Unit,
    }
}
