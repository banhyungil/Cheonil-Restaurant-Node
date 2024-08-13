import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'

export interface ExpenseAttributes {
    seq: number
    supplySeq: number
    amount: number
    cnt: number
    expenseAt: Date
    cmt?: string
    updatedAt?: Date
}

export type ExpensePk = 'seq'
export type ExpenseId = Expense[ExpensePk]
export type ExpenseOptionalAttributes = 'seq' | 'cmt' | 'updatedAt'
export type ExpenseCreationAttributes = Optional<ExpenseAttributes, ExpenseOptionalAttributes>

export class Expense extends Model<ExpenseAttributes, ExpenseCreationAttributes> implements ExpenseAttributes {
    seq!: number
    supplySeq!: number
    amount!: number
    cnt!: number
    expenseAt!: Date
    cmt?: string
    updatedAt?: Date

    static initModel(sequelize: Sequelize.Sequelize): typeof Expense {
        return sequelize.define(
            'Expense',
            {
                seq: {
                    autoIncrement: true,
                    type: DataTypes.BIGINT.UNSIGNED,
                    allowNull: false,
                    primaryKey: true,
                    comment: '지출 Seq',
                },
                supplySeq: {
                    type: DataTypes.SMALLINT.UNSIGNED,
                    allowNull: false,
                    comment: '식자재 Seq',
                },
                amount: {
                    type: DataTypes.INTEGER.UNSIGNED,
                    allowNull: false,
                    comment: '금액',
                },
                cnt: {
                    type: DataTypes.SMALLINT.UNSIGNED,
                    allowNull: false,
                    comment: '수량',
                },
                expenseAt: {
                    type: DataTypes.DATE,
                    allowNull: false,
                    comment: '지출 날짜',
                },
                cmt: {
                    type: DataTypes.STRING(100),
                    allowNull: true,
                    comment: '비고',
                },
                updatedAt: {
                    type: DataTypes.DATE,
                    allowNull: true,
                    defaultValue: Sequelize.Sequelize.fn('current_timestamp'),
                    comment: '수정시간',
                },
            },
            {
                tableName: 'Expense',
                timestamps: false,
                indexes: [
                    {
                        name: 'PRIMARY',
                        unique: true,
                        using: 'BTREE',
                        fields: [{ name: 'seq' }],
                    },
                    {
                        name: 'FK_Supply_TO_Expense',
                        using: 'BTREE',
                        fields: [{ name: 'supplySeq' }],
                    },
                ],
            },
        ) as typeof Expense
    }
}
