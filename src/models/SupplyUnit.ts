import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'

export interface SupplyUnitAttributes {
    unit: string
    suplSeq: number
}

export type SupplyUnitPk = 'unit' | 'suplSeq'
export type SupplyUnitId = SupplyUnit[SupplyUnitPk]
export type SupplyUnitCreationAttributes = SupplyUnitAttributes

export class SupplyUnit extends Model<SupplyUnitAttributes, SupplyUnitCreationAttributes> implements SupplyUnitAttributes {
    unit!: string
    suplSeq!: number

    static initModel(sequelize: Sequelize.Sequelize): typeof SupplyUnit {
        return sequelize.define(
            'SupplyUnit',
            {
                unit: {
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
            },
            {
                tableName: 'SupplyUnit',
                timestamps: false,
                indexes: [
                    {
                        name: 'PRIMARY',
                        unique: true,
                        using: 'BTREE',
                        fields: [{ name: 'unit' }, { name: 'suplSeq' }],
                    },
                    {
                        name: 'FK_Supply_TO_SupplyUnit',
                        using: 'BTREE',
                        fields: [{ name: 'suplSeq' }],
                    },
                ],
            },
        ) as typeof SupplyUnit
    }
}
