import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'

export interface MapStoreProductAttributes {
    storeSeq: number
    prdSeq: number
    options?: string
}

export type MapStoreProductPk = 'storeSeq' | 'prdSeq'
export type MapStoreProductId = MapStoreProduct[MapStoreProductPk]
export type MapStoreProductOptionalAttributes = 'options'
export type MapStoreProductCreationAttributes = Optional<MapStoreProductAttributes, MapStoreProductOptionalAttributes>

export class MapStoreProduct extends Model<MapStoreProductAttributes, MapStoreProductCreationAttributes> implements MapStoreProductAttributes {
    storeSeq!: number
    prdSeq!: number
    options?: string

    static initModel(sequelize: Sequelize.Sequelize): typeof MapStoreProduct {
        return sequelize.define(
            'MapStoreProduct',
            {
                storeSeq: {
                    type: DataTypes.SMALLINT.UNSIGNED,
                    allowNull: false,
                    primaryKey: true,
                    comment: '매장 Seq',
                },
                prdSeq: {
                    type: DataTypes.SMALLINT.UNSIGNED,
                    allowNull: false,
                    primaryKey: true,
                    comment: '제품 Seq',
                },
                options: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    comment: '추가 정보',
                },
            },
            {
                tableName: 'MapStoreProduct',
                timestamps: false,
                indexes: [
                    {
                        name: 'PRIMARY',
                        unique: true,
                        using: 'BTREE',
                        fields: [{ name: 'storeSeq' }, { name: 'prdSeq' }],
                    },
                    {
                        name: 'FK_Product_TO_MapStoreProduct',
                        using: 'BTREE',
                        fields: [{ name: 'prdSeq' }],
                    },
                ],
            },
        ) as typeof MapStoreProduct
    }
}
