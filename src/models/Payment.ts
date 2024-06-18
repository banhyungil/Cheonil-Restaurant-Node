import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'

export interface PaymentAttributes {
    id: number
    orderId: number
    amount: number
    payType: 'CASH' | 'CARD'
    payDate: Date
}

export type PaymentPk = 'id'
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
    orderId!: number
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
                orderId: {
                    type: DataTypes.BIGINT.UNSIGNED,
                    allowNull: false,
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
                        fields: [{ name: 'id' }],
                    },
                    {
                        name: 'fk_payment_t_order1_idx',
                        using: 'BTREE',
                        fields: [{ name: 'orderId' }],
                    },
                ],
            }
        )
    }
}
