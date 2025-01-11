import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'

export interface ExpenseAttributes {
    seq: number
    storeSeq: number
    prdSeq: number
    unitSeq: number
    unitCnt?: number
    price: number
    amount: number
    cnt: number
    expenseAt: Date
    cmt?: string
    options?: string
    updatedAt?: Date
}

export type ExpensePk = 'seq'
export type ExpenseId = Expense[ExpensePk]
export type ExpenseOptionalAttributes = 'seq' | 'unitCnt' | 'cmt' | 'options' | 'updatedAt'
export type ExpenseCreationAttributes = Optional<ExpenseAttributes, ExpenseOptionalAttributes>

export class Expense extends Model<ExpenseAttributes, ExpenseCreationAttributes> implements ExpenseAttributes {
    seq!: number
    storeSeq!: number
    prdSeq!: number
    unitSeq!: number
    unitCnt?: number
    price!: number
    amount!: number
    cnt!: number
    expenseAt!: Date
    cmt?: string
    options?: string
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
                storeSeq: {
                    type: DataTypes.SMALLINT.UNSIGNED,
                    allowNull: false,
                    comment: '매장 Seq',
                },
                prdSeq: {
                    type: DataTypes.SMALLINT.UNSIGNED,
                    allowNull: false,
                    comment: '제품 SEQ',
                },
                unitSeq: {
                    type: DataTypes.SMALLINT.UNSIGNED,
                    allowNull: false,
                    comment: '단위 SEQ',
                },
                unitCnt: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                    comment: '단위수량',
                },
                price: {
                    type: DataTypes.INTEGER.UNSIGNED,
                    allowNull: false,
                    comment: '가격',
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
                    comment: '지출일',
                },
                cmt: {
                    type: DataTypes.STRING(100),
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
                        name: 'FK_Store_TO_Expense',
                        using: 'BTREE',
                        fields: [{ name: 'storeSeq' }],
                    },
                    {
                        name: 'FK_MapProductUnit_TO_Expense',
                        using: 'BTREE',
                        fields: [{ name: 'prdSeq' }, { name: 'unitSeq' }],
                    },
                ],
            },
        ) as typeof Expense
    }
}
