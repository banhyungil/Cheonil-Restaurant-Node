import type { Sequelize } from 'sequelize'
import { config as _config } from './Config'
import type { configAttributes, configCreationAttributes } from './Config'
import { menu as _menu } from './Menu'
import type { menuAttributes, menuCreationAttributes } from './Menu'
import { menu_category as _menu_category } from './MenuCategory'
import type {
    menu_categoryAttributes,
    menu_categoryCreationAttributes,
} from './MenuCategory'
import { order_menu_rsv as _order_menu_rsv } from './OrderMenuRsv'
import type {
    order_menu_rsvAttributes,
    order_menu_rsvCreationAttributes,
} from './OrderMenuRsv'
import { order_rsv as _order_rsv } from './OrderRsv'
import type {
    order_rsvAttributes,
    order_rsvCreationAttributes,
} from './OrderRsv'
import { payment as _payment } from './Payment'
import type { paymentAttributes, paymentCreationAttributes } from './Payment'
import { store as _store } from './Store'
import type { storeAttributes, storeCreationAttributes } from './Store'
import { store_category as _store_category } from './StoreCategory'
import type {
    store_categoryAttributes,
    store_categoryCreationAttributes,
} from './StoreCategory'
import { t_order as _t_order } from './TOrder'
import type { t_orderAttributes, t_orderCreationAttributes } from './TOrder'
import { t_order_menu as _t_order_menu } from './TOrderMenu'
import type {
    t_order_menuAttributes,
    t_order_menuCreationAttributes,
} from './TOrderMenu'

export {
    _config as config,
    _menu as menu,
    _menu_category as menu_category,
    _order_menu_rsv as order_menu_rsv,
    _order_rsv as order_rsv,
    _payment as payment,
    _store as store,
    _store_category as store_category,
    _t_order as t_order,
    _t_order_menu as t_order_menu,
}

export type {
    configAttributes,
    configCreationAttributes,
    menuAttributes,
    menuCreationAttributes,
    menu_categoryAttributes,
    menu_categoryCreationAttributes,
    order_menu_rsvAttributes,
    order_menu_rsvCreationAttributes,
    order_rsvAttributes,
    order_rsvCreationAttributes,
    paymentAttributes,
    paymentCreationAttributes,
    storeAttributes,
    storeCreationAttributes,
    store_categoryAttributes,
    store_categoryCreationAttributes,
    t_orderAttributes,
    t_orderCreationAttributes,
    t_order_menuAttributes,
    t_order_menuCreationAttributes,
}

export function initModels(sequelize: Sequelize) {
    const config = _config.initModel(sequelize)
    const menu = _menu.initModel(sequelize)
    const menu_category = _menu_category.initModel(sequelize)
    const order_menu_rsv = _order_menu_rsv.initModel(sequelize)
    const order_rsv = _order_rsv.initModel(sequelize)
    const payment = _payment.initModel(sequelize)
    const store = _store.initModel(sequelize)
    const store_category = _store_category.initModel(sequelize)
    const t_order = _t_order.initModel(sequelize)
    const t_order_menu = _t_order_menu.initModel(sequelize)

    return {
        config: config,
        menu: menu,
        menu_category: menu_category,
        order_menu_rsv: order_menu_rsv,
        order_rsv: order_rsv,
        payment: payment,
        store: store,
        store_category: store_category,
        t_order: t_order,
        t_order_menu: t_order_menu,
    }
}
