import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'

export interface UnitAttributes {
    id: string
    isUnitCnt: number
    unitCntList?: string
}

export type UnitPk = 'id'
export type UnitId = Unit[UnitPk]
export type UnitOptionalAttributes = 'isUnitCnt' | 'unitCntList'
export type UnitCreationAttributes = Optional<UnitAttributes, UnitOptionalAttributes>

export class Unit extends Model<UnitAttributes, UnitCreationAttributes> implements UnitAttributes {
    id!: string
    isUnitCnt!: number
    unitCntList?: string

    static initModel(sequelize: Sequelize.Sequelize): typeof Unit {
        return sequelize.define(
            'Unit',
            {
                id: {
                    type: DataTypes.STRING(40),
                    allowNull: false,
                    primaryKey: true,
                    comment: '단위',
                },
                isUnitCnt: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                    defaultValue: 0,
                    comment: '단위수량 여부',
                },
                unitCntList: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    comment: '단위수량 목록',
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
                        fields: [{ name: 'id' }],
                    },
                ],
            },
        ) as typeof Unit
    }
}
