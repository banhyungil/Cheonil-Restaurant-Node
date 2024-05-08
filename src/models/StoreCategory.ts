import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'

export interface StoreCategoryAttributes {
    name: string
    created?: Date
    updated?: Date
    order: number
}

export type StoreCategoryPk = 'name'
export type StoreCategoryId = StoreCategory[StoreCategoryPk]
export type StoreCategoryOptionalAttributes = 'created' | 'updated' | 'order'
export type StoreCategoryCreationAttributes = Optional<
    StoreCategoryAttributes,
    StoreCategoryOptionalAttributes
>

export class StoreCategory
    extends Model<StoreCategoryAttributes, StoreCategoryCreationAttributes>
    implements StoreCategoryAttributes
{
    name!: string
    created?: Date
    updated?: Date
    order!: number

    static initModel(sequelize: Sequelize.Sequelize): typeof StoreCategory {
        return StoreCategory.init(
            {
                name: {
                    type: DataTypes.STRING(40),
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
                        fields: [{ name: 'name' }],
                    },
                ],
            }
        )
    }
}
