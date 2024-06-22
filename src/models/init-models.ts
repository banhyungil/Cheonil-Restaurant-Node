import type { Sequelize } from 'sequelize'
import { Config as _Config } from './Config'
import type { ConfigAttributes, ConfigCreationAttributes } from './Config'
import { Menu as _Menu } from './Menu'
import type { MenuAttributes, MenuCreationAttributes } from './Menu'
import { MenuCategory as _MenuCategory } from './MenuCategory'
import type {
    MenuCategoryAttributes,
    MenuCategoryCreationAttributes,
} from './MenuCategory'
import { Order as _Order } from './Order'
import type { OrderAttributes, OrderCreationAttributes } from './Order'
import { OrderMenu as _OrderMenu } from './OrderMenu'
import type {
    OrderMenuAttributes,
    OrderMenuCreationAttributes,
} from './OrderMenu'
import { OrderMenuRsv as _OrderMenuRsv } from './OrderMenuRsv'
import type {
    OrderMenuRsvAttributes,
    OrderMenuRsvCreationAttributes,
} from './OrderMenuRsv'
import { OrderRsv as _OrderRsv } from './OrderRsv'
import type { OrderRsvAttributes, OrderRsvCreationAttributes } from './OrderRsv'
import { Payment as _Payment } from './Payment'
import type { PaymentAttributes, PaymentCreationAttributes } from './Payment'
import { PlaceCategory as _PlaceCategory } from './PlaceCategory'
import type {
    PlaceCategoryAttributes,
    PlaceCategoryCreationAttributes,
} from './PlaceCategory'
import { Store as _Store } from './Store'
import type { StoreAttributes, StoreCreationAttributes } from './Store'
import { StoreCategory as _StoreCategory } from './StoreCategory'
import type {
    StoreCategoryAttributes,
    StoreCategoryCreationAttributes,
} from './StoreCategory'

export {
    _Config as Config,
    _Menu as Menu,
    _MenuCategory as MenuCategory,
    _Order as Order,
    _OrderMenu as OrderMenu,
    _OrderMenuRsv as OrderMenuRsv,
    _OrderRsv as OrderRsv,
    _Payment as Payment,
    _PlaceCategory as PlaceCategory,
    _Store as Store,
    _StoreCategory as StoreCategory,
}

export type {
    ConfigAttributes,
    ConfigCreationAttributes,
    MenuAttributes,
    MenuCreationAttributes,
    MenuCategoryAttributes,
    MenuCategoryCreationAttributes,
    OrderAttributes,
    OrderCreationAttributes,
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
    StoreAttributes,
    StoreCreationAttributes,
    StoreCategoryAttributes,
    StoreCategoryCreationAttributes,
}

export function initModels(sequelize: Sequelize) {
    const Config = _Config.initModel(sequelize)
    const Menu = _Menu.initModel(sequelize)
    const MenuCategory = _MenuCategory.initModel(sequelize)
    const Order = _Order.initModel(sequelize)
    const OrderMenu = _OrderMenu.initModel(sequelize)
    const OrderMenuRsv = _OrderMenuRsv.initModel(sequelize)
    const OrderRsv = _OrderRsv.initModel(sequelize)
    const Payment = _Payment.initModel(sequelize)
    const PlaceCategory = _PlaceCategory.initModel(sequelize)
    const Store = _Store.initModel(sequelize)
    const StoreCategory = _StoreCategory.initModel(sequelize)

    return {
        Config: Config,
        Menu: Menu,
        MenuCategory: MenuCategory,
        Order: Order,
        OrderMenu: OrderMenu,
        OrderMenuRsv: OrderMenuRsv,
        OrderRsv: OrderRsv,
        Payment: Payment,
        PlaceCategory: PlaceCategory,
        Store: Store,
        StoreCategory: StoreCategory,
    }
}
