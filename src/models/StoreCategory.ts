import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'

export interface StoreCategoryAttributes {
    name: string
    order: number
    placeCtgName?: string
    createdAt?: Date
    updatedAt?: Date
}

export type StoreCategoryPk = 'name'
export type StoreCategoryId = StoreCategory[StoreCategoryPk]
export type StoreCategoryOptionalAttributes =
    | 'order'
    | 'placeCtgName'
    | 'createdAt'
    | 'updatedAt'
export type StoreCategoryCreationAttributes = Optional<
    StoreCategoryAttributes,
    StoreCategoryOptionalAttributes
>

export class StoreCategory
    extends Model<StoreCategoryAttributes, StoreCategoryCreationAttributes>
    implements StoreCategoryAttributes
{
    name!: string
    order!: number
    placeCtgName?: string
    createdAt?: Date
    updatedAt?: Date

    static initModel(sequelize: Sequelize.Sequelize): typeof StoreCategory {
        return StoreCategory.init(
            {
                name: {
                    type: DataTypes.STRING(40),
                    allowNull: false,
                    primaryKey: true,
                },
                order: {
                    type: DataTypes.TINYINT.UNSIGNED,
                    allowNull: false,
                    defaultValue: 0,
                },
                placeCtgName: {
                    type: DataTypes.STRING(100),
                    allowNull: true,
                    comment: 'FK(placeCategory)',
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
