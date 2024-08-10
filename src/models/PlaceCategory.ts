import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'

export interface PlaceCategoryAttributes {
    seq: number
    name: string
    cmt?: string
    options?: string
}

export type PlaceCategoryPk = 'seq'
export type PlaceCategoryId = PlaceCategory[PlaceCategoryPk]
export type PlaceCategoryOptionalAttributes = 'seq' | 'cmt' | 'options'
export type PlaceCategoryCreationAttributes = Optional<PlaceCategoryAttributes, PlaceCategoryOptionalAttributes>

export class PlaceCategory extends Model<PlaceCategoryAttributes, PlaceCategoryCreationAttributes> implements PlaceCategoryAttributes {
    seq!: number
    name!: string
    cmt?: string
    options?: string

    static initModel(sequelize: Sequelize.Sequelize): typeof PlaceCategory {
        return sequelize.define(
            'PlaceCategory',
            {
                seq: {
                    autoIncrement: true,
                    type: DataTypes.BIGINT.UNSIGNED,
                    allowNull: false,
                    primaryKey: true,
                    comment: '장소 카테고리 Seq',
                },
                name: {
                    type: DataTypes.STRING(100),
                    allowNull: false,
                    comment: '장소 카테고리 명',
                    unique: 'name',
                },
                cmt: {
                    type: DataTypes.STRING(1000),
                    allowNull: true,
                    comment: '비고',
                },
                options: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    comment: '추가정보',
                },
            },
            {
                tableName: 'PlaceCategory',
                timestamps: false,
                indexes: [
                    {
                        name: 'PRIMARY',
                        unique: true,
                        using: 'BTREE',
                        fields: [{ name: 'seq' }],
                    },
                    {
                        name: 'name',
                        unique: true,
                        using: 'BTREE',
                        fields: [{ name: 'name' }],
                    },
                ],
            },
        ) as typeof PlaceCategory
    }
}
