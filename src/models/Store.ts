import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'

export interface StoreAttributes {
    seq: number
    ctgSeq: number
    placeCtgSeq?: number
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
export type StoreOptionalAttributes = 'seq' | 'placeCtgSeq' | 'cmt' | 'latitude' | 'longitude' | 'options' | 'createdAt' | 'updatedAt'
export type StoreCreationAttributes = Optional<StoreAttributes, StoreOptionalAttributes>

export class Store extends Model<StoreAttributes, StoreCreationAttributes> implements StoreAttributes {
    seq!: number
    ctgSeq!: number
    placeCtgSeq?: number
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
                    autoIncrement: true,
                    type: DataTypes.SMALLINT.UNSIGNED,
                    allowNull: false,
                    primaryKey: true,
                    comment: '매장 Seq',
                },
                ctgSeq: {
                    type: DataTypes.SMALLINT.UNSIGNED,
                    allowNull: false,
                    comment: '매장 카테고리 Seq',
                },
                placeCtgSeq: {
                    type: DataTypes.SMALLINT.UNSIGNED,
                    allowNull: true,
                    comment: '장소 카테고리 Seq',
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
                        name: 'FK_PlaceCategory_TO_Store',
                        using: 'BTREE',
                        fields: [{ name: 'placeCtgSeq' }],
                    },
                    {
                        name: 'FK_StoreCategory_TO_Store',
                        using: 'BTREE',
                        fields: [{ name: 'ctgSeq' }],
                    },
                ],
            },
        ) as typeof Store
    }
}
