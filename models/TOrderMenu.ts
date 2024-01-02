import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'

export interface t_order_menuAttributes {
    orderId: number
    menuId: number
    price: number
    cnt: number
}

export type t_order_menuPk = 'orderId' | 'menuId'
export type t_order_menuId = t_order_menu[t_order_menuPk]
export type t_order_menuCreationAttributes = t_order_menuAttributes

export class t_order_menu
    extends Model<t_order_menuAttributes, t_order_menuCreationAttributes>
    implements t_order_menuAttributes
{
    orderId!: number
    menuId!: number
    price!: number
    cnt!: number

    static initModel(sequelize: Sequelize.Sequelize): typeof t_order_menu {
        return t_order_menu.init(
            {
                orderId: {
                    type: DataTypes.BIGINT.UNSIGNED,
                    allowNull: false,
                    primaryKey: true,
                },
                menuId: {
                    type: DataTypes.BIGINT.UNSIGNED,
                    allowNull: false,
                    primaryKey: true,
                },
                price: {
                    type: DataTypes.BIGINT,
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
                tableName: 't_order_menu',
                timestamps: false,
                indexes: [
                    {
                        name: 'PRIMARY',
                        unique: true,
                        using: 'BTREE',
                        fields: [{ name: 'orderId' }, { name: 'menuId' }],
                    },
                    {
                        name: 'fk_t_order_menu_menu1_idx',
                        using: 'BTREE',
                        fields: [{ name: 'menuId' }],
                    },
                ],
            }
        )
    }
}
