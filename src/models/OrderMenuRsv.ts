import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface OrderMenuRsvAttributes {
    menuNm: string;
    orderRsvSeq: number;
    price: number;
    cnt: number;
}

export type OrderMenuRsvPk = "menuNm" | "orderRsvSeq";
export type OrderMenuRsvId = OrderMenuRsv[OrderMenuRsvPk];
export type OrderMenuRsvCreationAttributes = OrderMenuRsvAttributes;

export class OrderMenuRsv extends Model<OrderMenuRsvAttributes, OrderMenuRsvCreationAttributes> implements OrderMenuRsvAttributes {
    menuNm!: string;
    orderRsvSeq!: number;
    price!: number;
    cnt!: number;


    static initModel(sequelize: Sequelize.Sequelize): typeof OrderMenuRsv {
        return sequelize.define('OrderMenuRsv', {
        menuNm: {
            type: DataTypes.STRING(45),
            allowNull: false,
            primaryKey: true,
            comment: "메뉴 명"
        },
        orderRsvSeq: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false,
            primaryKey: true,
            comment: "주문예약 Seq"
        },
        price: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            comment: "가격 menu는 가격이 바뀔수가 있음"
        },
        cnt: {
            type: DataTypes.TINYINT.UNSIGNED,
            allowNull: false,
            comment: "수량"
        }
    }, {
        tableName: 'OrderMenuRsv',
        timestamps: false,
        indexes: [
            {
                name: "PRIMARY",
                unique: true,
                using: "BTREE",
                fields: [
                    { name: "menuNm" },
                    { name: "orderRsvSeq" },
                ]
            },
            {
                name: "FK_OrderRsv_TO_OrderMenuRsv",
                using: "BTREE",
                fields: [
                    { name: "orderRsvSeq" },
                ]
            },
            {
                name: "idx_menuNm",
                using: "BTREE",
                fields: [
                    { name: "menuNm" },
                ]
            },
            {
                name: "idx_orderRsvSeq",
                using: "BTREE",
                fields: [
                    { name: "orderRsvSeq" },
                ]
            },
        ]
    }) as typeof OrderMenuRsv;
    }
}
