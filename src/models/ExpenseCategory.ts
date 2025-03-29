import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'

export interface ExpenseCategoryAttributes {
    seq: number
    path: string
    options?: string
}

export type ExpenseCategoryPk = 'seq'
export type ExpenseCategoryId = ExpenseCategory[ExpenseCategoryPk]
export type ExpenseCategoryOptionalAttributes = 'seq' | 'options'
export type ExpenseCategoryCreationAttributes = Optional<ExpenseCategoryAttributes, ExpenseCategoryOptionalAttributes>

export class ExpenseCategory extends Model<ExpenseCategoryAttributes, ExpenseCategoryCreationAttributes> implements ExpenseCategoryAttributes {
    seq!: number
    path!: string
    options?: string

    static initModel(sequelize: Sequelize.Sequelize): typeof ExpenseCategory {
        return sequelize.define(
            'ExpenseCategory',
            {
                seq: {
                    autoIncrement: true,
                    type: DataTypes.INTEGER.UNSIGNED,
                    allowNull: false,
                    primaryKey: true,
                    comment: '지출 카테고리 SEQ',
                },
                path: {
                    type: DataTypes.STRING(50),
                    allowNull: false,
                    comment: '카테고리명',
                },
                options: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    comment: '추가 정보',
                },
            },
            {
                tableName: 'ExpenseCategory',
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
        ) as typeof ExpenseCategory
    }
}
