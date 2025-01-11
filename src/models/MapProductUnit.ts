import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'

export interface MapProductUnitAttributes {
    prdSeq: number
    unitSeq: number
    unitCntList?: string
}

export type MapProductUnitPk = 'prdSeq' | 'unitSeq'
export type MapProductUnitId = MapProductUnit[MapProductUnitPk]
export type MapProductUnitOptionalAttributes = 'unitCntList'
export type MapProductUnitCreationAttributes = Optional<MapProductUnitAttributes, MapProductUnitOptionalAttributes>

export class MapProductUnit extends Model<MapProductUnitAttributes, MapProductUnitCreationAttributes> implements MapProductUnitAttributes {
    prdSeq!: number
    unitSeq!: number
    unitCntList?: string

    static initModel(sequelize: Sequelize.Sequelize): typeof MapProductUnit {
        return sequelize.define(
            'MapProductUnit',
            {
                prdSeq: {
                    type: DataTypes.SMALLINT.UNSIGNED,
                    allowNull: false,
                    primaryKey: true,
                    comment: '제품 SEQ',
                },
                unitSeq: {
                    type: DataTypes.SMALLINT.UNSIGNED,
                    allowNull: false,
                    primaryKey: true,
                    comment: '단위 SEQ',
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
                        fields: [{ name: 'prdSeq' }, { name: 'unitSeq' }],
                    },
                ],
            },
        ) as typeof MapProductUnit
    }
}
