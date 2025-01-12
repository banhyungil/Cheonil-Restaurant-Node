import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'

export interface ProductAttributes {
    seq: number
    prdInfoSeq: number
    unitSeq: number
    unitCntList?: string
}

export type ProductPk = 'seq'
export type ProductId = Product[ProductPk]
export type ProductOptionalAttributes = 'seq' | 'unitCntList'
export type ProductCreationAttributes = Optional<ProductAttributes, ProductOptionalAttributes>

export class Product extends Model<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
    seq!: number
    prdInfoSeq!: number
    unitSeq!: number
    unitCntList?: string

    static initModel(sequelize: Sequelize.Sequelize): typeof Product {
        return sequelize.define(
            'Product',
            {
                seq: {
                    autoIncrement: true,
                    type: DataTypes.INTEGER.UNSIGNED,
                    allowNull: false,
                    primaryKey: true,
                    comment: 'SEQ',
                },
                prdInfoSeq: {
                    type: DataTypes.SMALLINT.UNSIGNED,
                    allowNull: false,
                    comment: '제품 SEQ',
                },
                unitSeq: {
                    type: DataTypes.SMALLINT.UNSIGNED,
                    allowNull: false,
                    comment: '단위 SEQ',
                },
                unitCntList: {
                    type: DataTypes.JSON,
                    allowNull: true,
                    comment: '단위수량 목록',
                    get() {
                        const val = this.getDataValue('unitCntList')
                        if (typeof val == 'string') return JSON.parse(this.getDataValue('unitCntList') as any)
                        else return val
                    },
                },
            },
            {
                tableName: 'Product',
                timestamps: false,
                indexes: [
                    {
                        name: 'PRIMARY',
                        unique: true,
                        using: 'BTREE',
                        fields: [{ name: 'seq' }],
                    },
                    {
                        name: 'FK_Product_TO_ProductInfo',
                        using: 'BTREE',
                        fields: [{ name: 'prdInfoSeq' }],
                    },
                    {
                        name: 'FK_Product_TO_Unit',
                        using: 'BTREE',
                        fields: [{ name: 'unitSeq' }],
                    },
                ],
            },
        ) as typeof Product
    }
}
