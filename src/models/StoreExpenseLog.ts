import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'

export interface StoreExpenseLogAttributes {
    seq: number
    storeSeq: number
    expenseAt: Date
    cmt: string
}

export type StoreExpenseLogPk = 'seq'
export type StoreExpenseLogId = StoreExpenseLog[StoreExpenseLogPk]
export type StoreExpenseLogOptionalAttributes = 'seq'
export type StoreExpenseLogCreationAttributes = Optional<StoreExpenseLogAttributes, StoreExpenseLogOptionalAttributes>

export class StoreExpenseLog extends Model<StoreExpenseLogAttributes, StoreExpenseLogCreationAttributes> implements StoreExpenseLogAttributes {
    seq!: number
    storeSeq!: number
    expenseAt!: Date
    cmt!: string

    static initModel(sequelize: Sequelize.Sequelize): typeof StoreExpenseLog {
        return sequelize.define(
            'StoreExpenseLog',
            {
                seq: {
                    autoIncrement: true,
                    type: DataTypes.BIGINT.UNSIGNED,
                    allowNull: false,
                    primaryKey: true,
                    comment: '매장 지출 로그 Seq',
                },
                storeSeq: {
                    type: DataTypes.SMALLINT.UNSIGNED,
                    allowNull: false,
                    comment: '매장 Seq',
                },
                expenseAt: {
                    type: DataTypes.DATE,
                    allowNull: false,
                    comment: '지출일',
                },
                cmt: {
                    type: DataTypes.STRING(200),
                    allowNull: false,
                    comment: '비고',
                },
            },
            {
                tableName: 'StoreExpenseLog',
                timestamps: false,
                indexes: [
                    {
                        name: 'PRIMARY',
                        unique: true,
                        using: 'BTREE',
                        fields: [{ name: 'seq' }],
                    },
                    {
                        name: 'FK_Store_TO_StoreExpenseLog',
                        using: 'BTREE',
                        fields: [{ name: 'storeSeq' }],
                    },
                ],
            },
        ) as typeof StoreExpenseLog
    }
}
