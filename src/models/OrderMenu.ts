import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'
import { Menu } from './Menu'

export interface OrderMenuAttributes {
    menuSeq: number
    orderSeq: number
    price: number
    cnt: number
    menu?: Menu
}

export type OrderMenuPk = 'menuSeq' | 'orderSeq'
export type OrderMenuId = OrderMenu[OrderMenuPk]
export type OrderMenuCreationAttributes = OrderMenuAttributes

export class OrderMenu extends Model<OrderMenuAttributes, OrderMenuCreationAttributes> implements OrderMenuAttributes {
    menuSeq!: number
    orderSeq!: number
    price!: number
    cnt!: number
    menu?: Menu

    static initModel(sequelize: Sequelize.Sequelize): typeof OrderMenu {
        return sequelize.define(
            'OrderMenu',
            {
                menuSeq: {
                    type: DataTypes.SMALLINT.UNSIGNED,
                    allowNull: false,
                    primaryKey: true,
                    comment: '메뉴 Seq',
                },
                orderSeq: {
                    type: DataTypes.BIGINT.UNSIGNED,
                    allowNull: false,
                    primaryKey: true,
                    comment: '주문 Seq',
                },
                price: {
                    type: DataTypes.INTEGER.UNSIGNED,
                    allowNull: false,
                    comment: '가격 menu는 가격이 바뀔수가 있음',
                },
                cnt: {
                    type: DataTypes.TINYINT.UNSIGNED,
                    allowNull: false,
                    comment: '수량',
                },
            },
            {
                tableName: 'OrderMenu',
                timestamps: false,
                indexes: [
                    {
                        name: 'PRIMARY',
                        unique: true,
                        using: 'BTREE',
                        fields: [{ name: 'menuSeq' }, { name: 'orderSeq' }],
                    },
                    {
                        name: 'FK_MyOrder_TO_OrderMenu',
                        using: 'BTREE',
                        fields: [{ name: 'orderSeq' }],
                    },
                ],
            },
        ) as typeof OrderMenu
    }
}
