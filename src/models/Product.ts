import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'

export interface ProductAttributes {
    seq: number
    suplSeq: number
    name: string
    cmt?: string
    options?: string
    createdAt?: Date
    updatedAt?: Date
}

export type ProductPk = 'seq'
export type ProductId = Product[ProductPk]
export type ProductOptionalAttributes = 'seq' | 'cmt' | 'options' | 'createdAt' | 'updatedAt'
export type ProductCreationAttributes = Optional<ProductAttributes, ProductOptionalAttributes>

export class Product extends Model<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
    seq!: number
    suplSeq!: number
    name!: string
    cmt?: string
    options?: string
    createdAt?: Date
    updatedAt?: Date

    static initModel(sequelize: Sequelize.Sequelize): typeof Product {
        return sequelize.define(
            'Product',
            {
                seq: {
                    autoIncrement: true,
                    type: DataTypes.SMALLINT.UNSIGNED,
                    allowNull: false,
                    primaryKey: true,
                    comment: '제품 Seq',
                },
                suplSeq: {
                    type: DataTypes.SMALLINT.UNSIGNED,
                    allowNull: false,
                    comment: '식자재 Seq',
                },
                name: {
                    type: DataTypes.STRING(100),
                    allowNull: false,
                    comment: '식자재 명',
                },
                cmt: {
                    type: DataTypes.STRING(200),
                    allowNull: true,
                    comment: '비고',
                },
                options: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    comment: '추가 정보',
                },
                createdAt: {
                    type: DataTypes.DATE,
                    allowNull: true,
                    defaultValue: Sequelize.Sequelize.fn('current_timestamp'),
                    comment: '생성시간',
                },
                updatedAt: {
                    type: DataTypes.DATE,
                    allowNull: true,
                    defaultValue: Sequelize.Sequelize.fn('current_timestamp'),
                    comment: '수정시간',
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
                ],
            },
        ) as typeof Product
    }
}
