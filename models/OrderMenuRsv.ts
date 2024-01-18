import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface OrderMenuRsvAttributes {
  orderRsvId: number;
  menuId: number;
  price: number;
  cnt: number;
}

export type OrderMenuRsvPk = "orderRsvId" | "menuId";
export type OrderMenuRsvId = OrderMenuRsv[OrderMenuRsvPk];
export type OrderMenuRsvCreationAttributes = OrderMenuRsvAttributes;

export class OrderMenuRsv extends Model<OrderMenuRsvAttributes, OrderMenuRsvCreationAttributes> implements OrderMenuRsvAttributes {
  orderRsvId!: number;
  menuId!: number;
  price!: number;
  cnt!: number;


  static initModel(sequelize: Sequelize.Sequelize): typeof OrderMenuRsv {
    return OrderMenuRsv.init({
    orderRsvId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    menuId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    price: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: "가격\nmenu는 가격이 바뀔수가 있음"
    },
    cnt: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      comment: "수량"
    }
  }, {
    sequelize,
    tableName: 'order_menu_rsv',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "orderRsvId" },
          { name: "menuId" },
        ]
      },
      {
        name: "fk_t_order_menu_menu1_idx",
        using: "BTREE",
        fields: [
          { name: "menuId" },
        ]
      },
      {
        name: "fk_t_order_menu_copy1_t_order_rsv1_idx",
        using: "BTREE",
        fields: [
          { name: "orderRsvId" },
        ]
      },
    ]
  });
  }
}
