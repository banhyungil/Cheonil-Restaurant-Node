import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface PaymentAttributes {
    seq: number;
    orderSeq: number;
    amount: number;
    payType: 'CASH' | 'CARD';
    payAt: Date;
}

export type PaymentPk = "seq";
export type PaymentId = Payment[PaymentPk];
export type PaymentOptionalAttributes = "seq" | "payType";
export type PaymentCreationAttributes = Optional<PaymentAttributes, PaymentOptionalAttributes>;

export class Payment extends Model<PaymentAttributes, PaymentCreationAttributes> implements PaymentAttributes {
    seq!: number;
    orderSeq!: number;
    amount!: number;
    payType!: 'CASH' | 'CARD';
    payAt!: Date;


    static initModel(sequelize: Sequelize.Sequelize): typeof Payment {
        return sequelize.define('Payment', {
        seq: {
            autoIncrement: true,
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false,
            primaryKey: true,
            comment: "결재 Seq"
        },
        orderSeq: {
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false,
            comment: "주문 Seq"
        },
        amount: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            comment: "결재 금액"
        },
        payType: {
            type: DataTypes.ENUM('CASH','CARD'),
            allowNull: false,
            defaultValue: "CASH",
            comment: "CASH: 현금, CARD: 카드"
        },
        payAt: {
            type: DataTypes.DATE,
            allowNull: false,
            comment: "지급날짜"
        }
    }, {
        tableName: 'Payment',
        timestamps: false,
        indexes: [
            {
                name: "PRIMARY",
                unique: true,
                using: "BTREE",
                fields: [
                    { name: "seq" },
                ]
            },
            {
                name: "FK_MyOrder_TO_Payment",
                using: "BTREE",
                fields: [
                    { name: "orderSeq" },
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
    }) as typeof Payment;
    }
}
