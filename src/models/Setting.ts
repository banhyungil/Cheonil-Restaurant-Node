import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'

export interface SettingAttributes {
    seq: number
    config: SettingConfig
}

export type SettingPk = 'seq'
export type SettingId = Setting[SettingPk]
export type SettingOptionalAttributes = 'seq'
export type SettingCreationAttributes = Optional<SettingAttributes, SettingOptionalAttributes>

export class Setting extends Model<SettingAttributes, SettingCreationAttributes> implements SettingAttributes {
    seq!: number
    config!: SettingConfig

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
                    get: function () {
                        return JSON.parse(this.getDataValue('config') as any)
                    },
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
