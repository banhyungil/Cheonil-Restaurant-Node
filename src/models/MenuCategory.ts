import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'

export interface MenuCategoryAttributes {
    seq: number
    name: string
    options?: string
    createdAt?: Date
    updatedAt?: Date
}

export type MenuCategoryPk = 'seq'
export type MenuCategoryId = MenuCategory[MenuCategoryPk]
export type MenuCategoryOptionalAttributes = 'seq' | 'options' | 'createdAt' | 'updatedAt'
export type MenuCategoryCreationAttributes = Optional<MenuCategoryAttributes, MenuCategoryOptionalAttributes>

export class MenuCategory extends Model<MenuCategoryAttributes, MenuCategoryCreationAttributes> implements MenuCategoryAttributes {
    seq!: number
    name!: string
    options?: string
    createdAt?: Date
    updatedAt?: Date

    static initModel(sequelize: Sequelize.Sequelize): typeof MenuCategory {
        return sequelize.define(
            'MenuCategory',
            {
                seq: {
                    autoIncrement: true,
                    type: DataTypes.BIGINT.UNSIGNED,
                    allowNull: false,
                    primaryKey: true,
                    comment: '메뉴 카테고리 Seq',
                },
                name: {
                    type: DataTypes.STRING(20),
                    allowNull: false,
                    comment: '메뉴 카테고리 명',
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
                tableName: 'MenuCategory',
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
        ) as typeof MenuCategory
    }
}
