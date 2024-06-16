import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'
import { TOrderMenuAttributes } from './TOrderMenu'
import { StoreAttributes } from './Store'

export interface TOrderAttributes {
    id: number
    storeName: string
    amount: number
    status: 'READY' | 'COMPLETE'
    orderTime: Date
    completeTime?: Date
    reqCmt?: string
    createdAt?: Date
    updatedAt?: Date
    orderMeneus?: TOrderMenuAttributes[]
    store?: StoreAttributes
}

export type TOrderPk = 'id' | 'storeName'
export type TOrderId = TOrder[TOrderPk]
export type TOrderOptionalAttributes =
    | 'id'
    | 'status'
    | 'orderTime'
    | 'completeTime'
    | 'reqCmt'
    | 'createdAt'
    | 'updatedAt'
export type TOrderCreationAttributes = Optional<
    TOrderAttributes,
    TOrderOptionalAttributes
>

export class TOrder
    extends Model<TOrderAttributes, TOrderCreationAttributes>
    implements TOrderAttributes
{
    id!: number
    storeName!: string
    amount!: number
    status!: 'READY' | 'COMPLETE'
    orderTime!: Date
    completeTime?: Date
    reqCmt?: string
    createdAt?: Date
    updatedAt?: Date

    static initModel(sequelize: Sequelize.Sequelize): typeof TOrder {
        return TOrder.init(
            {
                id: {
                    autoIncrement: true,
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
                    type: DataTypes.BIGINT.UNSIGNED,
                    allowNull: false,
                    comment: '총 금액\n외상인 경우는 어떻게 처리하지?...',
                },
                status: {
                    type: DataTypes.ENUM('READY', 'COMPLETE'),
                    allowNull: false,
                    defaultValue: 'READY',
                    comment: 'ready: 준비, complete: 완료',
                },
                orderTime: {
                    type: DataTypes.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.Sequelize.fn('current_timestamp'),
                    comment: '주문 시간',
                },
                completeTime: {
                    type: DataTypes.DATE,
                    allowNull: true,
                    comment: '조리완료 시간',
                },
                reqCmt: {
                    type: DataTypes.STRING(100),
                    allowNull: true,
                    comment: '요청 사항',
                },
            },
            {
                sequelize,
                tableName: 't_order',
                timestamps: true,
                indexes: [
                    {
                        name: 'PRIMARY',
                        unique: true,
                        using: 'BTREE',
                        fields: [{ name: 'id' }, { name: 'storeName' }],
                    },
                    {
                        name: 'fk_t_order_store1_idx',
                        using: 'BTREE',
                        fields: [{ name: 'storeName' }],
                    },
                ],
            }
        )
    }
}
