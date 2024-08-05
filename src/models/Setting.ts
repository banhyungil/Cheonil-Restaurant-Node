import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface SettingAttributes {
    config: string;
}

export type SettingCreationAttributes = SettingAttributes;

export class Setting extends Model<SettingAttributes, SettingCreationAttributes> implements SettingAttributes {
    config!: string;


    static initModel(sequelize: Sequelize.Sequelize): typeof Setting {
        return sequelize.define('Setting', {
        config: {
            type: DataTypes.TEXT,
            allowNull: false,
            comment: "설정 정보"
        }
    }, {
        tableName: 'Setting',
        timestamps: false
    }) as typeof Setting;
    }
}
