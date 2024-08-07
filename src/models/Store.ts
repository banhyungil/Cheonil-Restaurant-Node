import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'

export interface StoreAttributes {
    seq: number
    ctgNm: string
    placeCtgNm?: string
    name: string
    cmt?: string
    latitude?: number
    longitude?: number
    options?: string
    createdAt?: Date
    updatedAt?: Date
}

export type StorePk = 'seq'
export type StoreId = Store[StorePk]
export type StoreOptionalAttributes = 'placeCtgNm' | 'cmt' | 'latitude' | 'longitude' | 'options' | 'createdAt' | 'updatedAt'
export type StoreCreationAttributes = Optional<StoreAttributes, StoreOptionalAttributes>

export class Store extends Model<StoreAttributes, StoreCreationAttributes> implements StoreAttributes {
    seq!: number
    ctgNm!: string
    placeCtgNm?: string
    name!: string
    cmt?: string
    latitude?: number
    longitude?: number
    options?: string
    createdAt?: Date
    updatedAt?: Date

    static initModel(sequelize: Sequelize.Sequelize): typeof Store {
        return sequelize.define(
            'Store',
            {
                seq: {
                    type: DataTypes.BIGINT.UNSIGNED,
                    allowNull: false,
                    primaryKey: true,
                    comment: '매장 Seq',
                },
                ctgNm: {
                    type: DataTypes.STRING(45),
                    allowNull: false,
                    comment: '매장 카테고리 명',
                },
                placeCtgNm: {
                    type: DataTypes.STRING(100),
                    allowNull: true,
                    comment: '장소 카테고리 명',
                },
                name: {
                    type: DataTypes.STRING(45),
                    allowNull: false,
                    comment: '매장 명',
                    unique: 'name',
                },
                cmt: {
                    type: DataTypes.STRING(1000),
                    allowNull: true,
                    comment: '기타 정보',
                },
                latitude: {
                    type: DataTypes.FLOAT,
                    allowNull: true,
                    comment: '위도',
                },
                longitude: {
                    type: DataTypes.FLOAT,
                    allowNull: true,
                    comment: '경도',
                },
                options: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    comment: '추가정보',
                },
                createdAt: {
                    type: DataTypes.DATE,
                    allowNull: true,
                    defaultValue: Sequelize.Sequelize.fn('current_timestamp'),
                    comment: '생성시간',
                },
                updatedAt: {
                    type: DataTypes.DATE,
                    allowNull: true,
                    defaultValue: Sequelize.Sequelize.fn('current_timestamp'),
                    comment: '수정시간',
                },
            },
            {
                tableName: 'Store',
                timestamps: false,
                indexes: [
                    {
                        name: 'PRIMARY',
                        unique: true,
                        using: 'BTREE',
                        fields: [{ name: 'seq' }],
                    },
                    {
                        name: 'name',
                        unique: true,
                        using: 'BTREE',
                        fields: [{ name: 'name' }],
                    },
                    {
                        name: 'FK_StoreCategory_TO_Store',
                        using: 'BTREE',
                        fields: [{ name: 'ctgNm' }],
                    },
                    {
                        name: 'FK_PlaceCategory_TO_Store',
                        using: 'BTREE',
                        fields: [{ name: 'placeCtgNm' }],
                    },
                ],
            },
        ) as typeof Store
    }
}
