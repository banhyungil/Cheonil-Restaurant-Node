import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'

export interface OrderMenuAttributes {
    menuNm: string
    orderSeq: number
    price: number
    cnt: number
}

export type OrderMenuPk = 'menuNm' | 'orderSeq'
export type OrderMenuId = OrderMenu[OrderMenuPk]
export type OrderMenuCreationAttributes = OrderMenuAttributes

export class OrderMenu
    extends Model<OrderMenuAttributes, OrderMenuCreationAttributes>
    implements OrderMenuAttributes
{
    menuNm!: string
    orderSeq!: number
    price!: number
    cnt!: number

    static initModel(sequelize: Sequelize.Sequelize): typeof OrderMenu {
        return OrderMenu.init(
            {
                menuNm: {
                    type: DataTypes.STRING(45),
                    allowNull: false,
                    primaryKey: true,
                    comment: '메뉴명',
                },
                orderSeq: {
                    type: DataTypes.BIGINT.UNSIGNED,
                    allowNull: false,
                    primaryKey: true,
                    comment: '주문 ID',
                },
                price: {
                    type: DataTypes.INTEGER.UNSIGNED,
                    allowNull: false,
                    comment: '가격\nmenu는 가격이 바뀔수가 있음',
                },
                cnt: {
                    type: DataTypes.TINYINT.UNSIGNED,
                    allowNull: false,
                    comment: '수량',
                },
            },
            {
                sequelize,
                tableName: 'OrderMenu',
                timestamps: false,
                indexes: [
                    {
                        name: 'PRIMARY',
                        unique: true,
                        using: 'BTREE',
                        fields: [{ name: 'menuNm' }, { name: 'orderSeq' }],
                    },
                    {
                        name: 'fk_t_order_menu_menu1_idx',
                        using: 'BTREE',
                        fields: [{ name: 'menuNm' }],
                    },
                    {
                        name: 'fk_t_order_menu_t_order1_idx',
                        using: 'BTREE',
                        fields: [{ name: 'orderSeq' }],
                    },
                ],
            }
        )
    }
}
