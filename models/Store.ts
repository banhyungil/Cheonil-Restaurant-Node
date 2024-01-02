import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'

export interface storeAttributes {
    id: number
    categoryId: number
    name: string
    cmt?: string
    created?: Date
    updated?: Date
}

export type storePk = 'id'
export type storeId = store[storePk]
export type storeOptionalAttributes = 'id' | 'cmt' | 'created' | 'updated'
export type storeCreationAttributes = Optional<
    storeAttributes,
    storeOptionalAttributes
>

export class store
    extends Model<storeAttributes, storeCreationAttributes>
    implements storeAttributes
{
    id!: number
    categoryId!: number
    name!: string
    cmt?: string
    created?: Date
    updated?: Date

    static initModel(sequelize: Sequelize.Sequelize): typeof store {
        return store.init(
            {
                id: {
                    autoIncrement: true,
                    type: DataTypes.BIGINT.UNSIGNED,
                    allowNull: false,
                    primaryKey: true,
                },
                categoryId: {
                    type: DataTypes.BIGINT,
                    allowNull: false,
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
                        fields: [{ name: 'categoryId' }],
                    },
                ],
            }
        )
    }
}
