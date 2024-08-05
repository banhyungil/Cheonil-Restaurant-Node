import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface OrderMenuAttributes {
    name: string;
    orderSeq: number;
    price: number;
    cnt: number;
}

export type OrderMenuPk = "name" | "orderSeq";
export type OrderMenuId = OrderMenu[OrderMenuPk];
export type OrderMenuCreationAttributes = OrderMenuAttributes;

export class OrderMenu extends Model<OrderMenuAttributes, OrderMenuCreationAttributes> implements OrderMenuAttributes {
    name!: string;
    orderSeq!: number;
    price!: number;
    cnt!: number;


    static initModel(sequelize: Sequelize.Sequelize): typeof OrderMenu {
        return sequelize.define('OrderMenu', {
        name: {
            type: DataTypes.STRING(45),
            allowNull: false,
            primaryKey: true,
            comment: "메뉴 명"
        },
        orderSeq: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false,
            primaryKey: true,
            comment: "주문 Seq"
        },
        price: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            comment: "가격 menu는 가격이 바뀔수가 있음"
        },
        cnt: {
            type: DataTypes.TINYINT,
            allowNull: false,
            comment: "수량"
        }
    }, {
        tableName: 'OrderMenu',
        timestamps: false,
        indexes: [
            {
                name: "PRIMARY",
                unique: true,
                using: "BTREE",
                fields: [
                    { name: "name" },
                    { name: "orderSeq" },
                ]
            },
            {
                name: "FK_MyOrder_TO_OrderMenu",
                using: "BTREE",
                fields: [
                    { name: "orderSeq" },
                ]
            },
            {
                name: "idx_name",
                using: "BTREE",
                fields: [
                    { name: "name" },
                ]
            },
            {
                name: "idx_orderSeq",
                using: "BTREE",
                fields: [
                    { name: "orderSeq" },
                ]
            },
        ]
    }) as typeof OrderMenu;
    }
}
