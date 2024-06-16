import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'

export interface PaymentAttributes {
    id: number
    orderid: number
    storeName: string
    amount: number
    payType: 'CASH' | 'CARD'
    payDate: Date
}

export type PaymentPk = 'id' | 'orderid' | 'storeName'
export type PaymentId = Payment[PaymentPk]
export type PaymentOptionalAttributes = 'id'
export type PaymentCreationAttributes = Optional<
    PaymentAttributes,
    PaymentOptionalAttributes
>

export class Payment
    extends Model<PaymentAttributes, PaymentCreationAttributes>
    implements PaymentAttributes
{
    id!: number
    orderid!: number
    storeName!: string
    amount!: number
    payType!: 'CASH' | 'CARD'
    payDate!: Date

    static initModel(sequelize: Sequelize.Sequelize): typeof Payment {
        return Payment.init(
            {
                id: {
                    autoIncrement: true,
                    type: DataTypes.BIGINT.UNSIGNED,
                    allowNull: false,
                    primaryKey: true,
                    comment: '결재ID',
                },
                orderid: {
                    type: DataTypes.BIGINT.UNSIGNED,
                    allowNull: false,
                    primaryKey: true,
                    comment: '주문ID',
                },
                storeName: {
                    type: DataTypes.STRING(45),
                    allowNull: false,
                    primaryKey: true,
                    comment: '매장명',
                },
                amount: {
                    type: DataTypes.INTEGER.UNSIGNED,
                    allowNull: false,
                    comment: '결재금액',
                },
                payType: {
                    type: DataTypes.ENUM('CASH', 'CARD'),
                    allowNull: false,
                    comment: '결재방식',
                },
                payDate: {
                    type: DataTypes.DATE,
                    allowNull: false,
                    comment: '결재일',
                },
            },
            {
                sequelize,
                tableName: 'payment',
                timestamps: false,
                indexes: [
                    {
                        name: 'PRIMARY',
                        unique: true,
                        using: 'BTREE',
                        fields: [
                            { name: 'id' },
                            { name: 'orderid' },
                            { name: 'storeName' },
                        ],
                    },
                    {
                        name: 'fk_payment_t_order1_idx',
                        using: 'BTREE',
                        fields: [{ name: 'orderid' }, { name: 'storeName' }],
                    },
                ],
            }
        )
    }
}
