import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface ConfigAttributes {
  key: string;
  config: object;
}

export type ConfigPk = "key";
export type ConfigId = Config[ConfigPk];
export type ConfigCreationAttributes = ConfigAttributes;

export class Config extends Model<ConfigAttributes, ConfigCreationAttributes> implements ConfigAttributes {
  key!: string;
  config!: object;


  static initModel(sequelize: Sequelize.Sequelize): typeof Config {
    return Config.init({
    key: {
      type: DataTypes.STRING(20),
      allowNull: false,
      primaryKey: true
    },
    config: {
      type: DataTypes.JSON,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'config',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "key" },
        ]
      },
    ]
  });
  }
}
