import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'

export interface store_categoryAttributes {
    id: number
    name: string
    created?: Date
    updated?: Date
}

export type store_categoryPk = 'id'
export type store_categoryId = store_category[store_categoryPk]
export type store_categoryOptionalAttributes = 'created' | 'updated'
export type store_categoryCreationAttributes = Optional<
    store_categoryAttributes,
    store_categoryOptionalAttributes
>

export class store_category
    extends Model<store_categoryAttributes, store_categoryCreationAttributes>
    implements store_categoryAttributes
{
    id!: number
    name!: string
    created?: Date
    updated?: Date

    static initModel(sequelize: Sequelize.Sequelize): typeof store_category {
        return store_category.init(
            {
                id: {
                    type: DataTypes.BIGINT,
                    allowNull: false,
                    primaryKey: true,
                },
                name: {
                    type: DataTypes.STRING(40),
                    allowNull: false,
                },
                created: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
                updated: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
            },
            {
                sequelize,
                tableName: 'store_category',
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
