import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'

export interface UnitAttributes {
    seq: number
    name: string
    isUnitCnt: number
}

export type UnitPk = 'seq'
export type UnitId = Unit[UnitPk]
export type UnitOptionalAttributes = 'seq' | 'isUnitCnt'
export type UnitCreationAttributes = Optional<UnitAttributes, UnitOptionalAttributes>

export class Unit extends Model<UnitAttributes, UnitCreationAttributes> implements UnitAttributes {
    seq!: number
    name!: string
    isUnitCnt!: number

    static initModel(sequelize: Sequelize.Sequelize): typeof Unit {
        return sequelize.define(
            'Unit',
            {
                seq: {
                    autoIncrement: true,
                    type: DataTypes.SMALLINT.UNSIGNED,
                    allowNull: false,
                    primaryKey: true,
                    comment: '단위 SEQ',
                },
                name: {
                    type: DataTypes.STRING(40),
                    allowNull: false,
                    comment: '단위',
                },
                isUnitCnt: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                    defaultValue: 0,
                    comment: '단위수량 여부',
                },
            },
            {
                tableName: 'Unit',
                timestamps: false,
                indexes: [
                    {
                        name: 'PRIMARY',
                        unique: true,
                        using: 'BTREE',
                        fields: [{ name: 'seq' }],
                    },
                ],
            },
        ) as typeof Unit
    }
}
