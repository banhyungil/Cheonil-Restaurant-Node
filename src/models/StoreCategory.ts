import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'

export interface StoreCategoryAttributes {
    seq: number
    placeCtgSeq?: number
    name: string
    options?: string
    createdAt?: Date
    updatedAt?: Date
}

export type StoreCategoryPk = 'seq'
export type StoreCategoryId = StoreCategory[StoreCategoryPk]
export type StoreCategoryOptionalAttributes = 'seq' | 'placeCtgSeq' | 'options' | 'createdAt' | 'updatedAt'
export type StoreCategoryCreationAttributes = Optional<StoreCategoryAttributes, StoreCategoryOptionalAttributes>

export class StoreCategory extends Model<StoreCategoryAttributes, StoreCategoryCreationAttributes> implements StoreCategoryAttributes {
    seq!: number
    placeCtgSeq?: number
    name!: string
    options?: string
    createdAt?: Date
    updatedAt?: Date

    static initModel(sequelize: Sequelize.Sequelize): typeof StoreCategory {
        return sequelize.define(
            'StoreCategory',
            {
                seq: {
                    autoIncrement: true,
                    type: DataTypes.SMALLINT.UNSIGNED,
                    allowNull: false,
                    primaryKey: true,
                    comment: '매장 카테고리 Seq',
                },
                placeCtgSeq: {
                    type: DataTypes.SMALLINT.UNSIGNED,
                    allowNull: true,
                    comment: '장소 카테고리 Seq',
                },
                name: {
                    type: DataTypes.STRING(45),
                    allowNull: false,
                    comment: '매장 카테고리 명',
                    unique: 'name',
                },
                options: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    comment: '추가정보',
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
                tableName: 'StoreCategory',
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
                    {
                        name: 'FK_PlaceCategory_TO_StoreCategory',
                        using: 'BTREE',
                        fields: [{ name: 'placeCtgSeq' }],
                    },
                ],
            },
        ) as typeof StoreCategory
    }
}
