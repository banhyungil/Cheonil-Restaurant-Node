import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'
import { ExpenseProduct } from './ExpenseProduct'
import { ExpenseCategory } from './ExpenseCategory'
import { Store } from './Store'

export interface ExpenseAttributes {
    seq: number
    ctgSeq: number
    storeSeq?: number
    name: string
    amount: number
    expenseAt: Date
    cmt?: string
    options?: string
    updatedAt?: Date
    category?: ExpenseCategory
    store?: Store
    expsPrds?: ExpenseProduct[]
}

export type ExpensePk = 'seq'
export type ExpenseId = Expense[ExpensePk]
export type ExpenseOptionalAttributes = 'seq' | 'storeSeq' | 'cmt' | 'options' | 'updatedAt'
export type ExpenseCreationAttributes = Optional<ExpenseAttributes, ExpenseOptionalAttributes>

export class Expense extends Model<ExpenseAttributes, ExpenseCreationAttributes> implements ExpenseAttributes {
    seq!: number
    ctgSeq!: number
    storeSeq?: number
    name!: string
    amount!: number
    expenseAt!: Date
    cmt?: string
    options?: string
    updatedAt?: Date
    expsPrds?: ExpenseProduct[]

    static initModel(sequelize: Sequelize.Sequelize): typeof Expense {
        return sequelize.define(
            'Expense',
            {
                seq: {
                    autoIncrement: true,
                    type: DataTypes.BIGINT.UNSIGNED,
                    allowNull: false,
                    primaryKey: true,
                    comment: '지출 SEQ',
                },
                ctgSeq: {
                    type: DataTypes.INTEGER.UNSIGNED,
                    allowNull: false,
                    comment: '카테고리 SEQ',
                },
                storeSeq: {
                    type: DataTypes.SMALLINT.UNSIGNED,
                    allowNull: true,
                    comment: '매장 SEQ',
                },
                name: {
                    type: DataTypes.STRING(50),
                    allowNull: false,
                    comment: '지출명',
                },
                amount: {
                    type: DataTypes.INTEGER.UNSIGNED,
                    allowNull: false,
                    comment: '금액',
                },
                expenseAt: {
                    type: DataTypes.DATE,
                    allowNull: false,
                    comment: '지출일',
                },
                cmt: {
                    type: DataTypes.STRING(400),
                    allowNull: true,
                    comment: '비고',
                },
                options: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    comment: '추가 정보',
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
                        name: 'FK_Expense_TO_ExpenseCategory',
                        using: 'BTREE',
                        fields: [{ name: 'ctgSeq' }],
                    },
                    {
                        name: 'FK_Expense_TO_Store',
                        using: 'BTREE',
                        fields: [{ name: 'storeSeq' }],
                    },
                ],
            },
        ) as typeof Expense
    }
}
