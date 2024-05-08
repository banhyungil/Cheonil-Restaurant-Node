import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'

export interface OrderRsvAttributes {
    id: number
    storeId: number
    amount?: number
    payType: 'cash' | 'card' | 'credit'
    rsvTime: string
    reqCmt?: string
    periodType?: 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'
    created?: Date
    updated?: Date
}

export type OrderRsvPk = 'id'
export type OrderRsvId = OrderRsv[OrderRsvPk]
export type OrderRsvOptionalAttributes =
    | 'id'
    | 'amount'
    | 'payType'
    | 'reqCmt'
    | 'periodType'
    | 'created'
    | 'updated'
export type OrderRsvCreationAttributes = Optional<
    OrderRsvAttributes,
    OrderRsvOptionalAttributes
>

export class OrderRsv
    extends Model<OrderRsvAttributes, OrderRsvCreationAttributes>
    implements OrderRsvAttributes
{
    id!: number
    storeId!: number
    amount?: number
    payType!: 'cash' | 'card' | 'credit'
    rsvTime!: string
    reqCmt?: string
    periodType?: 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'
    created?: Date
    updated?: Date

    static initModel(sequelize: Sequelize.Sequelize): typeof OrderRsv {
        return OrderRsv.init(
            {
                id: {
                    autoIncrement: true,
                    type: DataTypes.BIGINT.UNSIGNED,
                    allowNull: false,
                    primaryKey: true,
                },
                storeId: {
                    type: DataTypes.BIGINT.UNSIGNED,
                    allowNull: false,
                },
                amount: {
                    type: DataTypes.BIGINT,
                    allowNull: true,
                    comment: '총 금액',
                },
                payType: {
                    type: DataTypes.ENUM('cash', 'card', 'credit'),
                    allowNull: false,
                    defaultValue: 'cash',
                    comment: 'cash: 현금, card: 카드, credit: 외상',
                },
                rsvTime: {
                    type: DataTypes.STRING(5),
                    allowNull: false,
                    comment: 'HH:MM',
                },
                reqCmt: {
                    type: DataTypes.STRING(100),
                    allowNull: true,
                    comment: '기타 정보',
                },
                periodType: {
                    type: DataTypes.ENUM(
                        'mon',
                        'tue',
                        'wed',
                        'thu',
                        'fri',
                        'sat',
                        'sun'
                    ),
                    allowNull: true,
                },
                created: {
                    type: DataTypes.DATE,
                    allowNull: true,
                    defaultValue: Sequelize.Sequelize.fn('current_timestamp'),
                },
                updated: {
                    type: DataTypes.DATE,
                    allowNull: true,
                    defaultValue: Sequelize.Sequelize.fn('current_timestamp'),
                },
            },
            {
                sequelize,
                tableName: 'order_rsv',
                timestamps: false,
                indexes: [
                    {
                        name: 'PRIMARY',
                        unique: true,
                        using: 'BTREE',
                        fields: [{ name: 'id' }],
                    },
                    {
                        name: 'fk_t_order_rsv_store1_idx',
                        using: 'BTREE',
                        fields: [{ name: 'storeId' }],
                    },
                ],
            }
        )
    }
}
