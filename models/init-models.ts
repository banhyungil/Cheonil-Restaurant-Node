import type { Sequelize } from "sequelize";
import { Config as _Config } from "./Config";
import type { ConfigAttributes, ConfigCreationAttributes } from "./Config";
import { Menu as _Menu } from "./Menu";
import type { MenuAttributes, MenuCreationAttributes } from "./Menu";
import { MenuCategory as _MenuCategory } from "./MenuCategory";
import type { MenuCategoryAttributes, MenuCategoryCreationAttributes } from "./MenuCategory";
import { OrderMenuRsv as _OrderMenuRsv } from "./OrderMenuRsv";
import type { OrderMenuRsvAttributes, OrderMenuRsvCreationAttributes } from "./OrderMenuRsv";
import { OrderRsv as _OrderRsv } from "./OrderRsv";
import type { OrderRsvAttributes, OrderRsvCreationAttributes } from "./OrderRsv";
import { Payment as _Payment } from "./Payment";
import type { PaymentAttributes, PaymentCreationAttributes } from "./Payment";
import { Store as _Store } from "./Store";
import type { StoreAttributes, StoreCreationAttributes } from "./Store";
import { StoreCategory as _StoreCategory } from "./StoreCategory";
import type { StoreCategoryAttributes, StoreCategoryCreationAttributes } from "./StoreCategory";
import { TOrder as _TOrder } from "./TOrder";
import type { TOrderAttributes, TOrderCreationAttributes } from "./TOrder";
import { TOrderMenu as _TOrderMenu } from "./TOrderMenu";
import type { TOrderMenuAttributes, TOrderMenuCreationAttributes } from "./TOrderMenu";

export {
  _Config as Config,
  _Menu as Menu,
  _MenuCategory as MenuCategory,
  _OrderMenuRsv as OrderMenuRsv,
  _OrderRsv as OrderRsv,
  _Payment as Payment,
  _Store as Store,
  _StoreCategory as StoreCategory,
  _TOrder as TOrder,
  _TOrderMenu as TOrderMenu,
};

export type {
  ConfigAttributes,
  ConfigCreationAttributes,
  MenuAttributes,
  MenuCreationAttributes,
  MenuCategoryAttributes,
  MenuCategoryCreationAttributes,
  OrderMenuRsvAttributes,
  OrderMenuRsvCreationAttributes,
  OrderRsvAttributes,
  OrderRsvCreationAttributes,
  PaymentAttributes,
  PaymentCreationAttributes,
  StoreAttributes,
  StoreCreationAttributes,
  StoreCategoryAttributes,
  StoreCategoryCreationAttributes,
  TOrderAttributes,
  TOrderCreationAttributes,
  TOrderMenuAttributes,
  TOrderMenuCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
  const Config = _Config.initModel(sequelize);
  const Menu = _Menu.initModel(sequelize);
  const MenuCategory = _MenuCategory.initModel(sequelize);
  const OrderMenuRsv = _OrderMenuRsv.initModel(sequelize);
  const OrderRsv = _OrderRsv.initModel(sequelize);
  const Payment = _Payment.initModel(sequelize);
  const Store = _Store.initModel(sequelize);
  const StoreCategory = _StoreCategory.initModel(sequelize);
  const TOrder = _TOrder.initModel(sequelize);
  const TOrderMenu = _TOrderMenu.initModel(sequelize);


  return {
    Config: Config,
    Menu: Menu,
    MenuCategory: MenuCategory,
    OrderMenuRsv: OrderMenuRsv,
    OrderRsv: OrderRsv,
    Payment: Payment,
    Store: Store,
    StoreCategory: StoreCategory,
    TOrder: TOrder,
    TOrderMenu: TOrderMenu,
  };
}
