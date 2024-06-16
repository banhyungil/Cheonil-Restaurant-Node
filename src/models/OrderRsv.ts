import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'

export interface OrderRsvAttributes {
    id: number
    storeName: string
    amount: number
    rsvTime: string
    weekDay: string
    reqCmt?: string
    createdAt?: Date
    updatedAt?: Date
}

export type OrderRsvPk = 'id' | 'storeName'
export type OrderRsvId = OrderRsv[OrderRsvPk]
export type OrderRsvOptionalAttributes =
    | 'id'
    | 'reqCmt'
    | 'createdAt'
    | 'updatedAt'
export type OrderRsvCreationAttributes = Optional<
    OrderRsvAttributes,
    OrderRsvOptionalAttributes
>

export class OrderRsv
    extends Model<OrderRsvAttributes, OrderRsvCreationAttributes>
    implements OrderRsvAttributes
{
    id!: number
    storeName!: string
    amount!: number
    rsvTime!: string
    weekDay!: string
    reqCmt?: string
    createdAt?: Date
    updatedAt?: Date

    static initModel(sequelize: Sequelize.Sequelize): typeof OrderRsv {
        return OrderRsv.init(
            {
                id: {
                    autoIncrement: true,
                    type: DataTypes.BIGINT.UNSIGNED,
                    allowNull: false,
                    primaryKey: true,
                    comment: '주문예약ID',
                },
                storeName: {
                    type: DataTypes.STRING(45),
                    allowNull: false,
                    primaryKey: true,
                    comment: '매장명',
                },
                amount: {
                    type: DataTypes.BIGINT.UNSIGNED,
                    allowNull: false,
                    comment: '총 금액',
                },
                rsvTime: {
                    type: DataTypes.STRING(5),
                    allowNull: false,
                    comment: 'HH:MM',
                },
                weekDay: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    comment: '요일 배열\nex) \n월요일: [1]\n월, 수: [1,3]',
                },
                reqCmt: {
                    type: DataTypes.STRING(1000),
                    allowNull: true,
                    comment: '기타 정보',
                },
            },
            {
                sequelize,
                tableName: 'order_rsv',
                timestamps: true,
                indexes: [
                    {
                        name: 'PRIMARY',
                        unique: true,
                        using: 'BTREE',
                        fields: [{ name: 'id' }, { name: 'storeName' }],
                    },
                    {
                        name: 'fk_t_order_rsv_store1_idx',
                        using: 'BTREE',
                        fields: [{ name: 'storeName' }],
                    },
                ],
            }
        )
    }
}
