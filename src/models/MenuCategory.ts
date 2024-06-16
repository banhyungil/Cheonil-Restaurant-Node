import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'

export interface MenuCategoryAttributes {
    name: string
    order: number
    createdAt?: Date
    updatedAt?: Date
}

export type MenuCategoryPk = 'name'
export type MenuCategoryId = MenuCategory[MenuCategoryPk]
export type MenuCategoryOptionalAttributes = 'order' | 'createdAt' | 'updatedAt'
export type MenuCategoryCreationAttributes = Optional<
    MenuCategoryAttributes,
    MenuCategoryOptionalAttributes
>

export class MenuCategory
    extends Model<MenuCategoryAttributes, MenuCategoryCreationAttributes>
    implements MenuCategoryAttributes
{
    name!: string
    order!: number
    createdAt?: Date
    updatedAt?: Date

    static initModel(sequelize: Sequelize.Sequelize): typeof MenuCategory {
        return MenuCategory.init(
            {
                name: {
                    type: DataTypes.STRING(45),
                    allowNull: false,
                    primaryKey: true,
                    comment: '카테고리명',
                },
                order: {
                    type: DataTypes.TINYINT.UNSIGNED,
                    allowNull: false,
                    defaultValue: 1,
                    comment: '표시순서',
                },
            },
            {
                sequelize,
                tableName: 'menu_category',
                timestamps: true,
                indexes: [
                    {
                        name: 'PRIMARY',
                        unique: true,
                        using: 'BTREE',
                        fields: [{ name: 'name' }],
                    },
                ],
            }
        )
    }
}
