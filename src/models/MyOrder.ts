import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'

export interface MyOrderAttributes {
    seq: number
    storeSeq: number
    amount: number
    status: 'READY' | 'COMPLETE'
    orderAt: Date
    completeAt?: Date
    cmt?: string
    updatedAt: Date
}

export type MyOrderPk = 'seq'
export type MyOrderId = MyOrder[MyOrderPk]
export type MyOrderOptionalAttributes = 'seq' | 'status' | 'orderAt' | 'completeAt' | 'cmt' | 'updatedAt'
export type MyOrderCreationAttributes = Optional<MyOrderAttributes, MyOrderOptionalAttributes>

export class MyOrder extends Model<MyOrderAttributes, MyOrderCreationAttributes> implements MyOrderAttributes {
    seq!: number
    storeSeq!: number
    amount!: number
    status!: 'READY' | 'COMPLETE'
    orderAt!: Date
    completeAt?: Date
    cmt?: string
    updatedAt!: Date

    static initModel(sequelize: Sequelize.Sequelize): typeof MyOrder {
        return sequelize.define(
            'MyOrder',
            {
                seq: {
                    autoIncrement: true,
                    type: DataTypes.BIGINT.UNSIGNED,
                    allowNull: false,
                    primaryKey: true,
                    comment: '주문 Seq',
                },
                storeSeq: {
                    type: DataTypes.BIGINT.UNSIGNED,
                    allowNull: false,
                    comment: '매장 Seq',
                },
                amount: {
                    type: DataTypes.INTEGER.UNSIGNED,
                    allowNull: false,
                    comment: '총 금액',
                },
                status: {
                    type: DataTypes.ENUM('READY', 'COMPLETE'),
                    allowNull: false,
                    defaultValue: 'READY',
                    comment: 'READY: 준비, COMPLETE: 완료',
                },
                orderAt: {
                    type: DataTypes.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.Sequelize.fn('current_timestamp'),
                    comment: '주문 시간',
                },
                completeAt: {
                    type: DataTypes.DATE,
                    allowNull: true,
                    comment: '조리완료 시간',
                },
                cmt: {
                    type: DataTypes.STRING(1000),
                    allowNull: true,
                    comment: '비고',
                },
                updatedAt: {
                    type: DataTypes.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.Sequelize.fn('current_timestamp'),
                    comment: '수정시간',
                },
            },
            {
                tableName: 'MyOrder',
                timestamps: false,
                indexes: [
                    {
                        name: 'PRIMARY',
                        unique: true,
                        using: 'BTREE',
                        fields: [{ name: 'seq' }],
                    },
                    {
                        name: 'FK_Store_TO_MyOrder',
                        using: 'BTREE',
                        fields: [{ name: 'storeSeq' }],
                    },
                ],
            },
        ) as typeof MyOrder
    }
}
