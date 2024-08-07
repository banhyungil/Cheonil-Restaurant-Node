import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'

export interface StoreCategoryAttributes {
    name: string
    placeCtgNm?: string
    options?: string
    createdAt?: Date
    updatedAt?: Date
}

export type StoreCategoryPk = 'name'
export type StoreCategoryId = StoreCategory[StoreCategoryPk]
export type StoreCategoryOptionalAttributes = 'placeCtgNm' | 'options' | 'createdAt' | 'updatedAt'
export type StoreCategoryCreationAttributes = Optional<StoreCategoryAttributes, StoreCategoryOptionalAttributes>

export class StoreCategory extends Model<StoreCategoryAttributes, StoreCategoryCreationAttributes> implements StoreCategoryAttributes {
    name!: string
    placeCtgNm?: string
    options?: string
    createdAt?: Date
    updatedAt?: Date

    static initModel(sequelize: Sequelize.Sequelize): typeof StoreCategory {
        return sequelize.define(
            'StoreCategory',
            {
                name: {
                    type: DataTypes.STRING(45),
                    allowNull: false,
                    primaryKey: true,
                    comment: '매장 카테고리 명',
                },
                placeCtgNm: {
                    type: DataTypes.STRING(100),
                    allowNull: true,
                    comment: '장소 카테고리 이름',
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
                        fields: [{ name: 'name' }],
                    },
                    {
                        name: 'FK_PlaceCategory_TO_StoreCategory',
                        using: 'BTREE',
                        fields: [{ name: 'placeCtgNm' }],
                    },
                ],
            },
        ) as typeof StoreCategory
    }
}
