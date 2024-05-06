import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'

export interface TOrderAttributes {
    id: number
    storeId: number
    amount?: number
    payType?: 'cash' | 'card'
    status: 'ready' | 'complete'
    payDate?: Date
    time: Date
    reqCmt?: string
    created?: Date
    updated?: Date
}

export type TOrderPk = 'id'
export type TOrderId = TOrder[TOrderPk]
export type TOrderOptionalAttributes =
    | 'id'
    | 'amount'
    | 'payType'
    | 'status'
    | 'payDate'
    | 'time'
    | 'reqCmt'
    | 'created'
    | 'updated'
export type TOrderCreationAttributes = Optional<
    TOrderAttributes,
    TOrderOptionalAttributes
>

export class TOrder
    extends Model<TOrderAttributes, TOrderCreationAttributes>
    implements TOrderAttributes
{
    id!: number
    storeId!: number
    amount?: number
    payType?: 'cash' | 'card'
    status!: 'ready' | 'complete'
    payDate?: Date
    time!: Date
    reqCmt?: string
    created?: Date
    updated?: Date

    static initModel(sequelize: Sequelize.Sequelize): typeof TOrder {
        return TOrder.init(
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
                    type: DataTypes.ENUM('cash', 'card'),
                    allowNull: true,
                    defaultValue: 'cash',
                    comment: 'cash: 현금, card: 카드',
                },
                status: {
                    type: DataTypes.ENUM('ready', 'complete'),
                    allowNull: false,
                    defaultValue: 'ready',
                    comment: 'ready: 준비, complete: 완료',
                },
                payDate: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
                time: {
                    type: DataTypes.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.Sequelize.fn('current_timestamp'),
                    comment: '주문 시간',
                },
                reqCmt: {
                    type: DataTypes.STRING(100),
                    allowNull: true,
                    comment: '기타 정보',
                },
                created: {
                    type: DataTypes.DATE,
                    allowNull: true,
                    defaultValue: Sequelize.Sequelize.fn('current_timestamp'),
                },
                updated: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
            },
            {
                sequelize,
                tableName: 't_order',
                timestamps: false,
                indexes: [
                    {
                        name: 'PRIMARY',
                        unique: true,
                        using: 'BTREE',
                        fields: [{ name: 'id' }],
                    },
                    {
                        name: 'fk_t_order_store1_idx',
                        using: 'BTREE',
                        fields: [{ name: 'storeId' }],
                    },
                ],
            }
        )
    }
}
