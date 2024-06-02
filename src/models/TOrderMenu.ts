import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'
import { MenuAttributes } from './Menu'

export interface TOrderMenuAttributes {
    orderId: number
    menuId: number
    price: number
    cnt: number
    menu?: MenuAttributes
}

export type TOrderMenuPk = 'orderId' | 'menuId'
export type TOrderMenuId = TOrderMenu[TOrderMenuPk]
export type TOrderMenuCreationAttributes = TOrderMenuAttributes

export class TOrderMenu
    extends Model<TOrderMenuAttributes, TOrderMenuCreationAttributes>
    implements TOrderMenuAttributes
{
    orderId!: number
    menuId!: number
    price!: number
    cnt!: number

    static initModel(sequelize: Sequelize.Sequelize): typeof TOrderMenu {
        return TOrderMenu.init(
            {
                orderId: {
                    type: DataTypes.BIGINT.UNSIGNED,
                    allowNull: false,
                    primaryKey: true,
                    references: { model: 'TOrder', key: 'id' },
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
