import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'

export interface MenuAttributes {
    name: string
    categoryName: string
    nameAbv?: string
    price: number
    cmt?: string
    createdAt?: Date
    updatedAt?: Date
}

export type MenuPk = 'name'
export type MenuId = Menu[MenuPk]
export type MenuOptionalAttributes =
    | 'nameAbv'
    | 'cmt'
    | 'createdAt'
    | 'updatedAt'
export type MenuCreationAttributes = Optional<
    MenuAttributes,
    MenuOptionalAttributes
>

export class Menu
    extends Model<MenuAttributes, MenuCreationAttributes>
    implements MenuAttributes
{
    name!: string
    categoryName!: string
    nameAbv?: string
    price!: number
    cmt?: string
    createdAt?: Date
    updatedAt?: Date

    static initModel(sequelize: Sequelize.Sequelize): typeof Menu {
        return Menu.init(
            {
                name: {
                    type: DataTypes.STRING(45),
                    allowNull: false,
                    primaryKey: true,
                    comment: '메뉴명',
                },
                categoryName: {
                    type: DataTypes.STRING(45),
                    allowNull: false,
                    comment: '카테고리명',
                },
                nameAbv: {
                    type: DataTypes.STRING(45),
                    allowNull: true,
                    comment: '이름 약어',
                },
                price: {
                    type: DataTypes.BIGINT.UNSIGNED,
                    allowNull: false,
                },
                cmt: {
                    type: DataTypes.STRING(1000),
                    allowNull: true,
                },
            },
            {
                sequelize,
                tableName: 'menu',
                timestamps: true,
                indexes: [
                    {
                        name: 'PRIMARY',
                        unique: true,
                        using: 'BTREE',
                        fields: [{ name: 'name' }],
                    },
                    {
                        name: 'fk_menu_menu_category1_idx',
                        using: 'BTREE',
                        fields: [{ name: 'categoryName' }],
                    },
                ],
            }
        )
    }
}
