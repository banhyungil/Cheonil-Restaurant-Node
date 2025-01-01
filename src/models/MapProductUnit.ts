import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'

export interface MapProductUnitAttributes {
    prdSeq: number
    unitNm: string
    unitCntList?: string
}

export type MapProductUnitPk = 'prdSeq' | 'unitNm'
export type MapProductUnitId = MapProductUnit[MapProductUnitPk]
export type MapProductUnitOptionalAttributes = 'prdSeq' | 'unitCntList'
export type MapProductUnitCreationAttributes = Optional<MapProductUnitAttributes, MapProductUnitOptionalAttributes>

export class MapProductUnit extends Model<MapProductUnitAttributes, MapProductUnitCreationAttributes> implements MapProductUnitAttributes {
    prdSeq!: number
    unitNm!: string
    unitCntList?: string

    static initModel(sequelize: Sequelize.Sequelize): typeof MapProductUnit {
        return sequelize.define(
            'MapProductUnit',
            {
                prdSeq: {
                    autoIncrement: true,
                    type: DataTypes.SMALLINT.UNSIGNED,
                    allowNull: false,
                    primaryKey: true,
                    comment: '제품 Seq',
                },
                unitNm: {
                    type: DataTypes.STRING(40),
                    allowNull: false,
                    primaryKey: true,
                    comment: '단위',
                },
                unitCntList: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    comment: '단위수량 목록',
                },
            },
            {
                tableName: 'MapProductUnit',
                timestamps: false,
                indexes: [
                    {
                        name: 'PRIMARY',
                        unique: true,
                        using: 'BTREE',
                        fields: [{ name: 'prdSeq' }, { name: 'unitNm' }],
                    },
                    {
                        name: 'FK_Unit_TO_MapProductUnit',
                        using: 'BTREE',
                        fields: [{ name: 'unitNm' }],
                    },
                ],
            },
        ) as typeof MapProductUnit
    }
}
