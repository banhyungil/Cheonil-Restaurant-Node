import type { Sequelize } from "sequelize";
import { Menu as _Menu } from "./Menu";
import type { MenuAttributes, MenuCreationAttributes } from "./Menu";
import { MenuCategory as _MenuCategory } from "./MenuCategory";
import type { MenuCategoryAttributes, MenuCategoryCreationAttributes } from "./MenuCategory";
import { MyOrder as _MyOrder } from "./MyOrder";
import type { MyOrderAttributes, MyOrderCreationAttributes } from "./MyOrder";
import { OrderMenu as _OrderMenu } from "./OrderMenu";
import type { OrderMenuAttributes, OrderMenuCreationAttributes } from "./OrderMenu";
import { OrderMenuRsv as _OrderMenuRsv } from "./OrderMenuRsv";
import type { OrderMenuRsvAttributes, OrderMenuRsvCreationAttributes } from "./OrderMenuRsv";
import { OrderRsv as _OrderRsv } from "./OrderRsv";
import type { OrderRsvAttributes, OrderRsvCreationAttributes } from "./OrderRsv";
import { Payment as _Payment } from "./Payment";
import type { PaymentAttributes, PaymentCreationAttributes } from "./Payment";
import { PlaceCategory as _PlaceCategory } from "./PlaceCategory";
import type { PlaceCategoryAttributes, PlaceCategoryCreationAttributes } from "./PlaceCategory";
import { Setting as _Setting } from "./Setting";
import type { SettingAttributes, SettingCreationAttributes } from "./Setting";
import { Store as _Store } from "./Store";
import type { StoreAttributes, StoreCreationAttributes } from "./Store";
import { StoreCategory as _StoreCategory } from "./StoreCategory";
import type { StoreCategoryAttributes, StoreCategoryCreationAttributes } from "./StoreCategory";

export {
    _Menu as Menu,
    _MenuCategory as MenuCategory,
    _MyOrder as MyOrder,
    _OrderMenu as OrderMenu,
    _OrderMenuRsv as OrderMenuRsv,
    _OrderRsv as OrderRsv,
    _Payment as Payment,
    _PlaceCategory as PlaceCategory,
    _Setting as Setting,
    _Store as Store,
    _StoreCategory as StoreCategory,
};

export type {
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
    SettingAttributes,
    SettingCreationAttributes,
    StoreAttributes,
    StoreCreationAttributes,
    StoreCategoryAttributes,
    StoreCategoryCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
    const Menu = _Menu.initModel(sequelize);
    const MenuCategory = _MenuCategory.initModel(sequelize);
    const MyOrder = _MyOrder.initModel(sequelize);
    const OrderMenu = _OrderMenu.initModel(sequelize);
    const OrderMenuRsv = _OrderMenuRsv.initModel(sequelize);
    const OrderRsv = _OrderRsv.initModel(sequelize);
    const Payment = _Payment.initModel(sequelize);
    const PlaceCategory = _PlaceCategory.initModel(sequelize);
    const Setting = _Setting.initModel(sequelize);
    const Store = _Store.initModel(sequelize);
    const StoreCategory = _StoreCategory.initModel(sequelize);


    return {
        Menu: Menu,
        MenuCategory: MenuCategory,
        MyOrder: MyOrder,
        OrderMenu: OrderMenu,
        OrderMenuRsv: OrderMenuRsv,
        OrderRsv: OrderRsv,
        Payment: Payment,
        PlaceCategory: PlaceCategory,
        Setting: Setting,
        Store: Store,
        StoreCategory: StoreCategory,
    };
}
