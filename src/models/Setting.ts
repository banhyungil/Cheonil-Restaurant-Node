import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'

export interface SettingAttributes {
    seq: number
    config: string
}

export type SettingPk = 'seq'
export type SettingId = Setting[SettingPk]
export type SettingOptionalAttributes = 'seq'
export type SettingCreationAttributes = Optional<SettingAttributes, SettingOptionalAttributes>

export class Setting extends Model<SettingAttributes, SettingCreationAttributes> implements SettingAttributes {
    seq!: number
    config!: string

    static initModel(sequelize: Sequelize.Sequelize): typeof Setting {
        return sequelize.define(
            'Setting',
            {
                seq: {
                    autoIncrement: true,
                    type: DataTypes.SMALLINT.UNSIGNED,
                    allowNull: false,
                    primaryKey: true,
                    comment: '설정 Seq',
                },
                config: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                    comment: '설정 정보',
                },
            },
            {
                tableName: 'Setting',
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
        ) as typeof Setting
    }
}
