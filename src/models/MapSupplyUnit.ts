import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'

export interface MapSupplyUnitAttributes {
    unitNm: string
    suplSeq: number
    unitCntList?: string
}

export type MapSupplyUnitPk = 'unitNm' | 'suplSeq'
export type MapSupplyUnitId = MapSupplyUnit[MapSupplyUnitPk]
export type MapSupplyUnitOptionalAttributes = 'unitCntList'
export type MapSupplyUnitCreationAttributes = Optional<MapSupplyUnitAttributes, MapSupplyUnitOptionalAttributes>

export class MapSupplyUnit extends Model<MapSupplyUnitAttributes, MapSupplyUnitCreationAttributes> implements MapSupplyUnitAttributes {
    unitNm!: string
    suplSeq!: number
    unitCntList?: string

    static initModel(sequelize: Sequelize.Sequelize): typeof MapSupplyUnit {
        return sequelize.define(
            'MapSupplyUnit',
            {
                unitNm: {
                    type: DataTypes.STRING(40),
                    allowNull: false,
                    primaryKey: true,
                    comment: '단위',
                },
                suplSeq: {
                    type: DataTypes.SMALLINT.UNSIGNED,
                    allowNull: false,
                    primaryKey: true,
                    comment: '식자재 Seq',
                },
                unitCntList: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    comment: '단위수량 목록',
                },
            },
            {
                tableName: 'MapSupplyUnit',
                timestamps: false,
                indexes: [
                    {
                        name: 'PRIMARY',
                        unique: true,
                        using: 'BTREE',
                        fields: [{ name: 'unitNm' }, { name: 'suplSeq' }],
                    },
                    {
                        name: 'FK_Supply_TO_SupplyUnit',
                        using: 'BTREE',
                        fields: [{ name: 'suplSeq' }],
                    },
                ],
            },
        ) as typeof MapSupplyUnit
    }
}
