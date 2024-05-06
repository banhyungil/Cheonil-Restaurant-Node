import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'

export interface StoreAttributes {
    id: number
    categoryName?: string
    name: string
    cmt?: string
    created?: Date
    updated?: Date
}

export type StorePk = 'id'
export type StoreId = Store[StorePk]
export type StoreOptionalAttributes =
    | 'id'
    | 'categoryName'
    | 'cmt'
    | 'created'
    | 'updated'
export type StoreCreationAttributes = Optional<
    StoreAttributes,
    StoreOptionalAttributes
>

export class Store
    extends Model<StoreAttributes, StoreCreationAttributes>
    implements StoreAttributes
{
    id!: number
    categoryName?: string
    name!: string
    cmt?: string
    created?: Date
    updated?: Date

    static initModel(sequelize: Sequelize.Sequelize): typeof Store {
        return Store.init(
            {
                id: {
                    autoIncrement: true,
                    type: DataTypes.BIGINT.UNSIGNED,
                    allowNull: false,
                    primaryKey: true,
                },
                categoryName: {
                    type: DataTypes.STRING(40),
                    allowNull: true,
                },
                name: {
                    type: DataTypes.STRING(40),
                    allowNull: false,
                },
                cmt: {
                    type: DataTypes.STRING(1000),
                    allowNull: true,
                    comment: '기타 정보',
                },
                created: {
                    type: DataTypes.DATE,
                    allowNull: true,
                    defaultValue: Sequelize.Sequelize.fn('current_timestamp'),
                },
                updated: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
            },
            {
                sequelize,
                tableName: 'store',
                timestamps: false,
                indexes: [
                    {
                        name: 'PRIMARY',
                        unique: true,
                        using: 'BTREE',
                        fields: [{ name: 'id' }],
                    },
                    {
                        name: 'fk_store_store_category1_idx',
                        using: 'BTREE',
                        fields: [{ name: 'categoryName' }],
                    },
                ],
            }
        )
    }
}
