import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'

export interface OrderRsvAttributes {
    id: number
    storeId: number
    amount: number
    payType: 'CASH' | 'CARD'
    rsvTimeF: string
    reqCmt?: string
    daysOfWeek?: string
    createdAt?: Date
    updatedAt?: Date
}

export type OrderRsvPk = 'id'
export type OrderRsvId = OrderRsv[OrderRsvPk]
export type OrderRsvOptionalAttributes =
    | 'id'
    | 'payType'
    | 'reqCmt'
    | 'daysOfWeek'
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
    storeId!: number
    amount!: number
    payType!: 'CASH' | 'CARD'
    rsvTimeF!: string
    reqCmt?: string
    daysOfWeek?: string
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
                },
                storeId: {
                    type: DataTypes.BIGINT.UNSIGNED,
                    allowNull: false,
                },
                amount: {
                    type: DataTypes.BIGINT,
                    allowNull: false,
                    comment: '총 금액',
                },
                payType: {
                    type: DataTypes.ENUM('CASH', 'CARD'),
                    allowNull: false,
                    defaultValue: 'CASH',
                    comment: 'CASH: 현금, CARD: 카드',
                },
                rsvTimeF: {
                    type: DataTypes.STRING(5),
                    allowNull: false,
                    comment: 'HH:MM',
                },
                reqCmt: {
                    type: DataTypes.STRING(100),
                    allowNull: true,
                    comment: '기타 정보',
                },
                daysOfWeek: {
                    type: DataTypes.STRING(3),
                    allowNull: true,
                    comment:
                        '요일 배열\r\nJS의 Date.getDay() 값\r\n0:일요일 ~ 6: 토요일\r\nex) 월요일, 수요일 예약\r\n[1, 3]',
                },
                createdAt: {
                    type: DataTypes.DATE,
                    allowNull: true,
                    defaultValue: Sequelize.Sequelize.fn('current_timestamp'),
                },
                updatedAt: {
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
