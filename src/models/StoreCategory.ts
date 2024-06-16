import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'

export interface StoreCategoryAttributes {
    name: string
    placeCtgName: string
    order?: number
    createdAt?: Date
    updatedAt?: Date
}

export type StoreCategoryPk = 'name'
export type StoreCategoryId = StoreCategory[StoreCategoryPk]
export type StoreCategoryOptionalAttributes =
    | 'order'
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
    placeCtgName!: string
    order?: number
    createdAt?: Date
    updatedAt?: Date

    static initModel(sequelize: Sequelize.Sequelize): typeof StoreCategory {
        return StoreCategory.init(
            {
                name: {
                    type: DataTypes.STRING(45),
                    allowNull: false,
                    primaryKey: true,
                },
                placeCtgName: {
                    type: DataTypes.STRING(45),
                    allowNull: false,
                },
                order: {
                    type: DataTypes.TINYINT.UNSIGNED,
                    allowNull: true,
                },
            },
            {
                sequelize,
                tableName: 'store_category',
                timestamps: true,
                indexes: [
                    {
                        name: 'PRIMARY',
                        unique: true,
                        using: 'BTREE',
                        fields: [{ name: 'name' }],
                    },
                    {
                        name: 'fk_store_category_placeCategory1_idx',
                        using: 'BTREE',
                        fields: [{ name: 'placeCtgName' }],
                    },
                ],
            }
        )
    }
}
