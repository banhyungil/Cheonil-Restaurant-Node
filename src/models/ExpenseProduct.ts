import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'

export interface ExpenseProductAttributes {
    expsSeq: number
    prdSeq: number
    cnt: number
    price: number
    unitCnt?: number
    cmt?: string
}

export type ExpenseProductPk = 'expsSeq' | 'prdSeq'
export type ExpenseProductId = ExpenseProduct[ExpenseProductPk]
export type ExpenseProductOptionalAttributes = 'unitCnt' | 'cmt'
export type ExpenseProductCreationAttributes = Optional<ExpenseProductAttributes, ExpenseProductOptionalAttributes>

export class ExpenseProduct extends Model<ExpenseProductAttributes, ExpenseProductCreationAttributes> implements ExpenseProductAttributes {
    expsSeq!: number
    prdSeq!: number
    cnt!: number
    price!: number
    unitCnt?: number
    cmt?: string

    static initModel(sequelize: Sequelize.Sequelize): typeof ExpenseProduct {
        return sequelize.define(
            'ExpenseProduct',
            {
                expsSeq: {
                    type: DataTypes.BIGINT.UNSIGNED,
                    allowNull: false,
                    primaryKey: true,
                    comment: '지출 Seq',
                },
                prdSeq: {
                    type: DataTypes.INTEGER.UNSIGNED,
                    allowNull: false,
                    primaryKey: true,
                    comment: '제품 SEQ',
                },
                cnt: {
                    type: DataTypes.SMALLINT.UNSIGNED,
                    allowNull: false,
                    comment: '수량',
                },
                price: {
                    type: DataTypes.BIGINT.UNSIGNED,
                    allowNull: false,
                    comment: '가격',
                },
                unitCnt: {
                    type: DataTypes.SMALLINT.UNSIGNED,
                    allowNull: true,
                    comment: '단위수량',
                },
                cmt: {
                    type: DataTypes.STRING(400),
                    allowNull: true,
                    comment: '비고',
                },
            },
            {
                tableName: 'ExpenseProduct',
                timestamps: false,
                indexes: [
                    {
                        name: 'PRIMARY',
                        unique: true,
                        using: 'BTREE',
                        fields: [{ name: 'expsSeq' }, { name: 'prdSeq' }],
                    },
                    {
                        name: 'FK_ExpenseProduct_TO_Expense',
                        using: 'BTREE',
                        fields: [{ name: 'expsSeq' }],
                    },
                    {
                        name: 'FK_ExpenseProduct_TO_Product',
                        using: 'BTREE',
                        fields: [{ name: 'prdSeq' }],
                    },
                ],
            },
        ) as typeof ExpenseProduct
    }
}
