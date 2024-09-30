import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'

export interface MapStoreProductAttributes {
    seq: number
    storeSeq: number
    prdSeq: number
    unitCnt?: number
    options?: string
}

export type MapStoreProductPk = 'seq'
export type MapStoreProductId = MapStoreProduct[MapStoreProductPk]
export type MapStoreProductOptionalAttributes = 'seq' | 'unitCnt' | 'options'
export type MapStoreProductCreationAttributes = Optional<MapStoreProductAttributes, MapStoreProductOptionalAttributes>

export class MapStoreProduct extends Model<MapStoreProductAttributes, MapStoreProductCreationAttributes> implements MapStoreProductAttributes {
    seq!: number
    storeSeq!: number
    prdSeq!: number
    unitCnt?: number
    options?: string

    static initModel(sequelize: Sequelize.Sequelize): typeof MapStoreProduct {
        return sequelize.define(
            'MapStoreProduct',
            {
                seq: {
                    autoIncrement: true,
                    type: DataTypes.BIGINT.UNSIGNED,
                    allowNull: false,
                    primaryKey: true,
                    comment: '맵핑 Seq',
                },
                storeSeq: {
                    type: DataTypes.SMALLINT.UNSIGNED,
                    allowNull: false,
                    comment: '매장 Seq',
                },
                prdSeq: {
                    type: DataTypes.SMALLINT.UNSIGNED,
                    allowNull: false,
                    comment: '제품 Seq',
                },
                unitCnt: {
                    type: DataTypes.SMALLINT.UNSIGNED,
                    allowNull: true,
                    comment: '단위수량',
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
                        fields: [{ name: 'seq' }],
                    },
                    {
                        name: 'FK_Store_TO_MapStoreProduct',
                        using: 'BTREE',
                        fields: [{ name: 'storeSeq' }],
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
