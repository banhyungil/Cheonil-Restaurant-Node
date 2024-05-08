import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'

export interface MenuCategoryAttributes {
    name: string
    created?: Date
    updated?: Date
    order: number
    menu_categorycol?: string
}

export type MenuCategoryPk = 'name'
export type MenuCategoryId = MenuCategory[MenuCategoryPk]
export type MenuCategoryOptionalAttributes =
    | 'created'
    | 'updated'
    | 'order'
    | 'menu_categorycol'
export type MenuCategoryCreationAttributes = Optional<
    MenuCategoryAttributes,
    MenuCategoryOptionalAttributes
>

export class MenuCategory
    extends Model<MenuCategoryAttributes, MenuCategoryCreationAttributes>
    implements MenuCategoryAttributes
{
    name!: string
    created?: Date
    updated?: Date
    order!: number
    menu_categorycol?: string

    static initModel(sequelize: Sequelize.Sequelize): typeof MenuCategory {
        return MenuCategory.init(
            {
                name: {
                    type: DataTypes.STRING(20),
                    allowNull: false,
                    primaryKey: true,
                },
                created: {
                    type: DataTypes.DATE,
                    allowNull: true,
                    defaultValue: Sequelize.Sequelize.fn('current_timestamp'),
                },
                updated: {
                    type: DataTypes.DATE,
                    allowNull: true,
                    defaultValue: Sequelize.Sequelize.fn('current_timestamp'),
                },
                order: {
                    type: DataTypes.TINYINT.UNSIGNED,
                    allowNull: false,
                    defaultValue: 0,
                },
                menu_categorycol: {
                    type: DataTypes.STRING(45),
                    allowNull: true,
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
