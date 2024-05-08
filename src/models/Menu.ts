import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'

export interface MenuAttributes {
    id: number
    categoryName?: string
    name: string
    nameAbv?: string
    price: number
    cmt?: string
    created?: Date
    updated?: Date
}

export type MenuPk = 'id'
export type MenuId = Menu[MenuPk]
export type MenuOptionalAttributes =
    | 'id'
    | 'categoryName'
    | 'nameAbv'
    | 'cmt'
    | 'created'
    | 'updated'
export type MenuCreationAttributes = Optional<
    MenuAttributes,
    MenuOptionalAttributes
>

export class Menu
    extends Model<MenuAttributes, MenuCreationAttributes>
    implements MenuAttributes
{
    id!: number
    categoryName?: string
    name!: string
    nameAbv?: string
    price!: number
    cmt?: string
    created?: Date
    updated?: Date

    static initModel(sequelize: Sequelize.Sequelize): typeof Menu {
        return Menu.init(
            {
                id: {
                    autoIncrement: true,
                    type: DataTypes.BIGINT.UNSIGNED,
                    allowNull: false,
                    primaryKey: true,
                },
                categoryName: {
                    type: DataTypes.STRING(20),
                    allowNull: true,
                },
                name: {
                    type: DataTypes.STRING(20),
                    allowNull: false,
                },
                nameAbv: {
                    type: DataTypes.STRING(10),
                    allowNull: true,
                    comment: '이름 약어',
                },
                price: {
                    type: DataTypes.BIGINT,
                    allowNull: false,
                },
                cmt: {
                    type: DataTypes.STRING(1000),
                    allowNull: true,
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
            },
            {
                sequelize,
                tableName: 'menu',
                timestamps: false,
                indexes: [
                    {
                        name: 'PRIMARY',
                        unique: true,
                        using: 'BTREE',
                        fields: [{ name: 'id' }],
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
