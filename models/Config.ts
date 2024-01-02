import * as Sequelize from 'sequelize'
import { DataTypes, Model } from 'sequelize'

export interface configAttributes {
    key: string
    config: object
}

export type configPk = 'key'
export type configId = config[configPk]
export type configCreationAttributes = configAttributes

export class config
    extends Model<configAttributes, configCreationAttributes>
    implements configAttributes
{
    key!: string
    config!: object

    static initModel(sequelize: Sequelize.Sequelize): typeof config {
        return config.init(
            {
                key: {
                    type: DataTypes.STRING(20),
                    allowNull: false,
                    primaryKey: true,
                },
                config: {
                    type: DataTypes.JSON,
                    allowNull: false,
                },
            },
            {
                sequelize,
                tableName: 'config',
                timestamps: false,
                indexes: [
                    {
                        name: 'PRIMARY',
                        unique: true,
                        using: 'BTREE',
                        fields: [{ name: 'key' }],
                    },
                ],
            }
        )
    }
}
