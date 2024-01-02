import * as Sequelize from 'sequelize'
import { DataTypes, Model } from 'sequelize'

export interface order_menu_rsvAttributes {
    orderRsvId: number
    menuId: number
    price: number
    cnt: number
}

export type order_menu_rsvPk = 'orderRsvId' | 'menuId'
export type order_menu_rsvId = order_menu_rsv[order_menu_rsvPk]
export type order_menu_rsvCreationAttributes = order_menu_rsvAttributes

export class order_menu_rsv
    extends Model<order_menu_rsvAttributes, order_menu_rsvCreationAttributes>
    implements order_menu_rsvAttributes
{
    orderRsvId!: number
    menuId!: number
    price!: number
    cnt!: number

    static initModel(sequelize: Sequelize.Sequelize): typeof order_menu_rsv {
        return order_menu_rsv.init(
            {
                orderRsvId: {
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
                tableName: 'order_menu_rsv',
                timestamps: false,
                indexes: [
                    {
                        name: 'PRIMARY',
                        unique: true,
                        using: 'BTREE',
                        fields: [{ name: 'orderRsvId' }, { name: 'menuId' }],
                    },
                    {
                        name: 'fk_t_order_menu_menu1_idx',
                        using: 'BTREE',
                        fields: [{ name: 'menuId' }],
                    },
                    {
                        name: 'fk_t_order_menu_copy1_t_order_rsv1_idx',
                        using: 'BTREE',
                        fields: [{ name: 'orderRsvId' }],
                    },
                ],
            }
        )
    }
}
