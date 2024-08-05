import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'

export interface OrderMenuRsvAttributes {
    menuSeq: number
    orderRsvSeq: number
    price: number
    cnt: number
}

export type OrderMenuRsvPk = 'menuSeq' | 'orderRsvSeq'
export type OrderMenuRsvId = OrderMenuRsv[OrderMenuRsvPk]
export type OrderMenuRsvCreationAttributes = OrderMenuRsvAttributes

export class OrderMenuRsv extends Model<OrderMenuRsvAttributes, OrderMenuRsvCreationAttributes> implements OrderMenuRsvAttributes {
    menuSeq!: number
    orderRsvSeq!: number
    price!: number
    cnt!: number

    static initModel(sequelize: Sequelize.Sequelize): typeof OrderMenuRsv {
        return sequelize.define(
            'OrderMenuRsv',
            {
                menuSeq: {
                    type: DataTypes.BIGINT.UNSIGNED,
                    allowNull: false,
                    primaryKey: true,
                    comment: '메뉴 Seq',
                },
                orderRsvSeq: {
                    type: DataTypes.BIGINT.UNSIGNED,
                    allowNull: false,
                    primaryKey: true,
                    comment: '주문예약 Seq',
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
                tableName: 'OrderMenuRsv',
                timestamps: false,
                indexes: [
                    {
                        name: 'PRIMARY',
                        unique: true,
                        using: 'BTREE',
                        fields: [{ name: 'menuSeq' }, { name: 'orderRsvSeq' }],
                    },
                    {
                        name: 'FK_OrderRsv_TO_OrderMenuRsv',
                        using: 'BTREE',
                        fields: [{ name: 'orderRsvSeq' }],
                    },
                ],
            },
        ) as typeof OrderMenuRsv
    }
}
