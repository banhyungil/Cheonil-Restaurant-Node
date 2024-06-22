import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'

export interface PaymentAttributes {
    seq: number
    orderSeq: number
    amount: number
    payType: 'CASH' | 'CARD'
    payDate: Date
}

export type PaymentPk = 'seq'
export type PaymentId = Payment[PaymentPk]
export type PaymentOptionalAttributes = 'seq'
export type PaymentCreationAttributes = Optional<
    PaymentAttributes,
    PaymentOptionalAttributes
>

export class Payment
    extends Model<PaymentAttributes, PaymentCreationAttributes>
    implements PaymentAttributes
{
    seq!: number
    orderSeq!: number
    amount!: number
    payType!: 'CASH' | 'CARD'
    payDate!: Date

    static initModel(sequelize: Sequelize.Sequelize): typeof Payment {
        return Payment.init(
            {
                seq: {
                    autoIncrement: true,
                    type: DataTypes.BIGINT.UNSIGNED,
                    allowNull: false,
                    primaryKey: true,
                    comment: '결재 SEQ',
                },
                orderSeq: {
                    type: DataTypes.BIGINT.UNSIGNED,
                    allowNull: false,
                    comment: '주문 Seq',
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
                tableName: 'Payment',
                timestamps: false,
                indexes: [
                    {
                        name: 'PRIMARY',
                        unique: true,
                        using: 'BTREE',
                        fields: [{ name: 'seq' }],
                    },
                    {
                        name: 'fk_payment_t_order1_idx',
                        using: 'BTREE',
                        fields: [{ name: 'orderSeq' }],
                    },
                ],
            }
        )
    }
}
