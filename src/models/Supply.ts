import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'

export interface SupplyAttributes {
    seq: number
    name: string
    unitList: string[]
    unitCntList?: number[]
    options?: string
    createdAt?: Date
    updatedAt?: Date
}

export type SupplyPk = 'seq'
export type SupplyId = Supply[SupplyPk]
export type SupplyOptionalAttributes = 'seq' | 'unitCntList' | 'options' | 'createdAt' | 'updatedAt'
export type SupplyCreationAttributes = Optional<SupplyAttributes, SupplyOptionalAttributes>

export class Supply extends Model<SupplyAttributes, SupplyCreationAttributes> implements SupplyAttributes {
    seq!: number
    name!: string
    unitList!: string[]
    unitCntList?: number[]
    options?: string
    createdAt?: Date
    updatedAt?: Date

    static initModel(sequelize: Sequelize.Sequelize): typeof Supply {
        return sequelize.define(
            'Supply',
            {
                seq: {
                    autoIncrement: true,
                    type: DataTypes.SMALLINT.UNSIGNED,
                    allowNull: false,
                    primaryKey: true,
                    comment: '식자재 Seq',
                },
                name: {
                    type: DataTypes.STRING(100),
                    allowNull: false,
                    comment: '식자재 명',
                },
                unitList: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    comment: '단위 목록',
                    get: function () {
                        return JSON.parse(this.getDataValue('unitList') as any)
                    },
                    set: function (val) {
                        this.setDataValue('unitList', JSON.stringify(val) as any)
                    },
                },
                unitCntList: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    comment: '단위수량 목록',
                },
                options: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    comment: '추가 정보',
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
                tableName: 'Supply',
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
        ) as typeof Supply
    }
}
