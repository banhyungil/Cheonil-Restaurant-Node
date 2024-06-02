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
                    type: DataTypes.STRING(20),
                    allowNull: false,
                    primaryKey: true,
                },
                order: {
                    type: DataTypes.TINYINT.UNSIGNED,
                    allowNull: false,
                    defaultValue: 0,
                },
                createdAt: {
                    type: DataTypes.DATE,
                    allowNull: true,
                    defaultValue: Sequelize.Sequelize.fn('current_timestamp'),
                },
                updatedAt: {
                    type: DataTypes.DATE,
                    allowNull: true,
                    defaultValue: Sequelize.Sequelize.fn('current_timestamp'),
                },
            },
            {
                sequelize,
                tableName: 'menu_category',
                timestamps: false,
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
