import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'

export interface menu_categoryAttributes {
    id: number
    name: string
    created?: Date
    updated?: Date
}

export type menu_categoryPk = 'id'
export type menu_categoryId = menu_category[menu_categoryPk]
export type menu_categoryOptionalAttributes = 'id' | 'created' | 'updated'
export type menu_categoryCreationAttributes = Optional<
    menu_categoryAttributes,
    menu_categoryOptionalAttributes
>

export class menu_category
    extends Model<menu_categoryAttributes, menu_categoryCreationAttributes>
    implements menu_categoryAttributes
{
    id!: number
    name!: string
    created?: Date
    updated?: Date

    static initModel(sequelize: Sequelize.Sequelize): typeof menu_category {
        return menu_category.init(
            {
                id: {
                    autoIncrement: true,
                    type: DataTypes.BIGINT.UNSIGNED,
                    allowNull: false,
                    primaryKey: true,
                },
                name: {
                    type: DataTypes.STRING(20),
                    allowNull: false,
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
                tableName: 'menu_category',
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
