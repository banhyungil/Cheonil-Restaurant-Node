import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'

export interface menuAttributes {
    id: number
    categoryId?: number
    name: string
    price: number
    cmt?: string
    created?: Date
    updated?: Date
}

export type menuPk = 'id'
export type menuId = menu[menuPk]
export type menuOptionalAttributes =
    | 'id'
    | 'categoryId'
    | 'cmt'
    | 'created'
    | 'updated'
export type menuCreationAttributes = Optional<
    menuAttributes,
    menuOptionalAttributes
>

export class menu
    extends Model<menuAttributes, menuCreationAttributes>
    implements menuAttributes
{
    id!: number
    categoryId?: number
    name!: string
    price!: number
    cmt?: string
    created?: Date
    updated?: Date

    static initModel(sequelize: Sequelize.Sequelize): typeof menu {
        return menu.init(
            {
                id: {
                    autoIncrement: true,
                    type: DataTypes.BIGINT.UNSIGNED,
                    allowNull: false,
                    primaryKey: true,
                },
                categoryId: {
                    type: DataTypes.BIGINT.UNSIGNED,
                    allowNull: true,
                },
                name: {
                    type: DataTypes.STRING(20),
                    allowNull: false,
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
                    defaultValue:
                        Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
                },
                updated: {
                    type: DataTypes.DATE,
                    allowNull: true,
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
                ],
            }
        )
    }
}
