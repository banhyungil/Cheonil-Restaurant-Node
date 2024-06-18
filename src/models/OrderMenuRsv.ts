import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'

export interface OrderMenuRsvAttributes {
    menuName: string
    orderRsvId: number
    price: number
    cnt: number
}

export type OrderMenuRsvPk = 'menuName' | 'orderRsvId'
export type OrderMenuRsvId = OrderMenuRsv[OrderMenuRsvPk]
export type OrderMenuRsvCreationAttributes = OrderMenuRsvAttributes

export class OrderMenuRsv
    extends Model<OrderMenuRsvAttributes, OrderMenuRsvCreationAttributes>
    implements OrderMenuRsvAttributes
{
    menuName!: string
    orderRsvId!: number
    price!: number
    cnt!: number

    static initModel(sequelize: Sequelize.Sequelize): typeof OrderMenuRsv {
        return OrderMenuRsv.init(
            {
                menuName: {
                    type: DataTypes.STRING(45),
                    allowNull: false,
                    primaryKey: true,
                    comment: '메뉴명',
                },
                orderRsvId: {
                    type: DataTypes.BIGINT.UNSIGNED,
                    allowNull: false,
                    primaryKey: true,
                    comment: '주문예약ID',
                },
                price: {
                    type: DataTypes.BIGINT.UNSIGNED,
                    allowNull: false,
                    comment: '가격\nmenu는 가격이 바뀔수가 있음',
                },
                cnt: {
                    type: DataTypes.BIGINT.UNSIGNED,
                    allowNull: false,
                    comment: '수량',
                },
            },
            {
                sequelize,
                tableName: 'order_menu_rsv',
                timestamps: false,
                indexes: [
                    {
                        name: 'PRIMARY',
                        unique: true,
                        using: 'BTREE',
                        fields: [{ name: 'menuName' }, { name: 'orderRsvId' }],
                    },
                    {
                        name: 'fk_order_menu_rsv_menu1_idx',
                        using: 'BTREE',
                        fields: [{ name: 'menuName' }],
                    },
                    {
                        name: 'fk_order_menu_rsv_order_rsv1_idx',
                        using: 'BTREE',
                        fields: [{ name: 'orderRsvId' }],
                    },
                ],
            }
        )
    }
}
