import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'

export interface StoreAttributes {
    name: string
    categoryName: string
    placeCtgName: string
    cmt?: string
    latitude?: string
    longitude?: string
    createdAt?: Date
    updatedAt?: Date
}

export type StorePk = 'name'
export type StoreId = Store[StorePk]
export type StoreOptionalAttributes =
    | 'cmt'
    | 'latitude'
    | 'longitude'
    | 'createdAt'
    | 'updatedAt'
export type StoreCreationAttributes = Optional<
    StoreAttributes,
    StoreOptionalAttributes
>

export class Store
    extends Model<StoreAttributes, StoreCreationAttributes>
    implements StoreAttributes
{
    name!: string
    categoryName!: string
    placeCtgName!: string
    cmt?: string
    latitude?: string
    longitude?: string
    createdAt?: Date
    updatedAt?: Date

    static initModel(sequelize: Sequelize.Sequelize): typeof Store {
        return Store.init(
            {
                name: {
                    type: DataTypes.STRING(45),
                    allowNull: false,
                    primaryKey: true,
                },
                categoryName: {
                    type: DataTypes.STRING(45),
                    allowNull: false,
                },
                placeCtgName: {
                    type: DataTypes.STRING(45),
                    allowNull: false,
                    comment: '기본적으로 매장 카테고리에 등록된 값과 일치',
                },
                cmt: {
                    type: DataTypes.STRING(1000),
                    allowNull: true,
                    comment: '기타 정보',
                },
                latitude: {
                    type: DataTypes.STRING(20),
                    allowNull: true,
                    comment: '위도',
                },
                longitude: {
                    type: DataTypes.STRING(20),
                    allowNull: true,
                    comment: '경도',
                },
            },
            {
                sequelize,
                tableName: 'store',
                timestamps: true,
                indexes: [
                    {
                        name: 'PRIMARY',
                        unique: true,
                        using: 'BTREE',
                        fields: [{ name: 'name' }],
                    },
                    {
                        name: 'fk_store_store_category1_idx',
                        using: 'BTREE',
                        fields: [{ name: 'categoryName' }],
                    },
                    {
                        name: 'fk_store_placeCategory1_idx',
                        using: 'BTREE',
                        fields: [{ name: 'placeCtgName' }],
                    },
                ],
            }
        )
    }
}
