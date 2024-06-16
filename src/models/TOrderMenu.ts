import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'
import { MenuAttributes } from './Menu'

export interface TOrderMenuAttributes {
    name: string
    orderId: number
    storeName: string
    price: number
    cnt: number
    menu?: MenuAttributes
}

export type TOrderMenuPk = 'name' | 'orderId' | 'storeName'
export type TOrderMenuId = TOrderMenu[TOrderMenuPk]
export type TOrderMenuCreationAttributes = TOrderMenuAttributes

export class TOrderMenu
    extends Model<TOrderMenuAttributes, TOrderMenuCreationAttributes>
    implements TOrderMenuAttributes
{
    name!: string
    orderId!: number
    storeName!: string
    price!: number
    cnt!: number

    static initModel(sequelize: Sequelize.Sequelize): typeof TOrderMenu {
        return TOrderMenu.init(
            {
                name: {
                    type: DataTypes.STRING(45),
                    allowNull: false,
                    primaryKey: true,
                    comment: '메뉴명',
                },
                orderId: {
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
                tableName: 't_order_menu',
                timestamps: false,
                indexes: [
                    {
                        name: 'PRIMARY',
                        unique: true,
                        using: 'BTREE',
                        fields: [
                            { name: 'name' },
                            { name: 'orderId' },
                            { name: 'storeName' },
                        ],
                    },
                    {
                        name: 'fk_t_order_menu_menu1_idx',
                        using: 'BTREE',
                        fields: [{ name: 'name' }],
                    },
                    {
                        name: 'fk_t_order_menu_t_order1_idx',
                        using: 'BTREE',
                        fields: [{ name: 'orderId' }, { name: 'storeName' }],
                    },
                ],
            }
        )
    }
}
