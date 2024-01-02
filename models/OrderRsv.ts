import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'

export interface order_rsvAttributes {
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

export type order_rsvPk = 'id'
export type order_rsvId = order_rsv[order_rsvPk]
export type order_rsvOptionalAttributes =
    | 'id'
    | 'amount'
    | 'payType'
    | 'reqCmt'
    | 'periodType'
    | 'created'
    | 'updated'
export type order_rsvCreationAttributes = Optional<
    order_rsvAttributes,
    order_rsvOptionalAttributes
>

export class order_rsv
    extends Model<order_rsvAttributes, order_rsvCreationAttributes>
    implements order_rsvAttributes
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

    static initModel(sequelize: Sequelize.Sequelize): typeof order_rsv {
        return order_rsv.init(
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
                    defaultValue:
                        Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
                },
                updated: {
                    type: DataTypes.DATE,
                    allowNull: true,
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
