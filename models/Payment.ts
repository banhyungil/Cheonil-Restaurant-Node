import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'

export interface paymentAttributes {
    id: number
    payDate?: Date
    created?: Date
    updated?: Date
}

export type paymentPk = 'id'
export type paymentId = payment[paymentPk]
export type paymentOptionalAttributes = 'id' | 'payDate' | 'created' | 'updated'
export type paymentCreationAttributes = Optional<
    paymentAttributes,
    paymentOptionalAttributes
>

export class payment
    extends Model<paymentAttributes, paymentCreationAttributes>
    implements paymentAttributes
{
    id!: number
    payDate?: Date
    created?: Date
    updated?: Date

    static initModel(sequelize: Sequelize.Sequelize): typeof payment {
        return payment.init(
            {
                id: {
                    autoIncrement: true,
                    type: DataTypes.BIGINT,
                    allowNull: false,
                    primaryKey: true,
                },
                payDate: {
                    type: DataTypes.DATE,
                    allowNull: true,
                    comment: '실제 대금 납부일',
                },
                created: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
                updated: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
            },
            {
                sequelize,
                tableName: 'payment',
                timestamps: false,
                indexes: [
                    {
                        name: 'PRIMARY',
                        unique: true,
                        using: 'BTREE',
                        fields: [{ name: 'id' }],
                    },
                ],
            }
        )
    }
}
