import type { Sequelize } from 'sequelize'
import { Expense as _Expense } from './Expense'
import type { ExpenseAttributes, ExpenseCreationAttributes } from './Expense'
import { ExpenseCategory as _ExpenseCategory } from './ExpenseCategory'
import type { ExpenseCategoryAttributes, ExpenseCategoryCreationAttributes } from './ExpenseCategory'
import { ExpenseProduct as _ExpenseProduct } from './ExpenseProduct'
import type { ExpenseProductAttributes, ExpenseProductCreationAttributes } from './ExpenseProduct'
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
import { ProductInfo as _ProductInfo } from './ProductInfo'
import type { ProductInfoAttributes, ProductInfoCreationAttributes } from './ProductInfo'
import { Setting as _Setting } from './Setting'
import type { SettingAttributes, SettingCreationAttributes } from './Setting'
import { Store as _Store } from './Store'
import type { StoreAttributes, StoreCreationAttributes } from './Store'
import { StoreCategory as _StoreCategory } from './StoreCategory'
import type { StoreCategoryAttributes, StoreCategoryCreationAttributes } from './StoreCategory'
import { Supply as _Supply } from './Supply'
import type { SupplyAttributes, SupplyCreationAttributes } from './Supply'
import { Unit as _Unit } from './Unit'
import type { UnitAttributes, UnitCreationAttributes } from './Unit'

export {
    _Expense as Expense,
    _ExpenseCategory as ExpenseCategory,
    _ExpenseProduct as ExpenseProduct,
    _Menu as Menu,
    _MenuCategory as MenuCategory,
    _MyOrder as MyOrder,
    _OrderMenu as OrderMenu,
    _OrderMenuRsv as OrderMenuRsv,
    _OrderRsv as OrderRsv,
    _Payment as Payment,
    _PlaceCategory as PlaceCategory,
    _Product as Product,
    _ProductInfo as ProductInfo,
    _Setting as Setting,
    _Store as Store,
    _StoreCategory as StoreCategory,
    _Supply as Supply,
    _Unit as Unit,
}

export type {
    ExpenseAttributes,
    ExpenseCreationAttributes,
    ExpenseCategoryAttributes,
    ExpenseCategoryCreationAttributes,
    ExpenseProductAttributes,
    ExpenseProductCreationAttributes,
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
    ProductInfoAttributes,
    ProductInfoCreationAttributes,
    SettingAttributes,
    SettingCreationAttributes,
    StoreAttributes,
    StoreCreationAttributes,
    StoreCategoryAttributes,
    StoreCategoryCreationAttributes,
    SupplyAttributes,
    SupplyCreationAttributes,
    UnitAttributes,
    UnitCreationAttributes,
}

export function initModels(sequelize: Sequelize) {
    const Expense = _Expense.initModel(sequelize)
    const ExpenseCategory = _ExpenseCategory.initModel(sequelize)
    const ExpenseProduct = _ExpenseProduct.initModel(sequelize)
    const Menu = _Menu.initModel(sequelize)
    const MenuCategory = _MenuCategory.initModel(sequelize)
    const MyOrder = _MyOrder.initModel(sequelize)
    const OrderMenu = _OrderMenu.initModel(sequelize)
    const OrderMenuRsv = _OrderMenuRsv.initModel(sequelize)
    const OrderRsv = _OrderRsv.initModel(sequelize)
    const Payment = _Payment.initModel(sequelize)
    const PlaceCategory = _PlaceCategory.initModel(sequelize)
    const Product = _Product.initModel(sequelize)
    const ProductInfo = _ProductInfo.initModel(sequelize)
    const Setting = _Setting.initModel(sequelize)
    const Store = _Store.initModel(sequelize)
    const StoreCategory = _StoreCategory.initModel(sequelize)
    const Supply = _Supply.initModel(sequelize)
    const Unit = _Unit.initModel(sequelize)

    return {
        Expense: Expense,
        ExpenseCategory: ExpenseCategory,
        ExpenseProduct: ExpenseProduct,
        Menu: Menu,
        MenuCategory: MenuCategory,
        MyOrder: MyOrder,
        OrderMenu: OrderMenu,
        OrderMenuRsv: OrderMenuRsv,
        OrderRsv: OrderRsv,
        Payment: Payment,
        PlaceCategory: PlaceCategory,
        Product: Product,
        ProductInfo: ProductInfo,
        Setting: Setting,
        Store: Store,
        StoreCategory: StoreCategory,
        Supply: Supply,
        Unit: Unit,
    }
}
