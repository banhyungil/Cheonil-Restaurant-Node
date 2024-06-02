import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'

export interface PlaceCategoryAttributes {
    name: string
    cmt?: string
}

export type PlaceCategoryPk = 'name'
export type PlaceCategoryId = PlaceCategory[PlaceCategoryPk]
export type PlaceCategoryOptionalAttributes = 'cmt'
export type PlaceCategoryCreationAttributes = Optional<
    PlaceCategoryAttributes,
    PlaceCategoryOptionalAttributes
>

export class PlaceCategory
    extends Model<PlaceCategoryAttributes, PlaceCategoryCreationAttributes>
    implements PlaceCategoryAttributes
{
    name!: string
    cmt?: string

    static initModel(sequelize: Sequelize.Sequelize): typeof PlaceCategory {
        return PlaceCategory.init(
            {
                name: {
                    type: DataTypes.STRING(100),
                    allowNull: false,
                    primaryKey: true,
                },
                cmt: {
                    type: DataTypes.STRING(400),
                    allowNull: true,
                    comment: '주석',
                },
            },
            {
                sequelize,
                tableName: 'placeCategory',
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
