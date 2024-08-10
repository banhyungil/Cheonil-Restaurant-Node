import * as Sequelize from 'sequelize'
import { DataTypes, Model, Optional } from 'sequelize'

export interface MenuAttributes {
    seq: number
    ctgSeq: number
    name: string
    abv?: string
    price: number
    cmt?: string
    options?: string
    createdAt?: Date
    updatedAt?: Date
}

export type MenuPk = 'seq'
export type MenuId = Menu[MenuPk]
export type MenuOptionalAttributes = 'seq' | 'abv' | 'cmt' | 'options' | 'createdAt' | 'updatedAt'
export type MenuCreationAttributes = Optional<MenuAttributes, MenuOptionalAttributes>

export class Menu extends Model<MenuAttributes, MenuCreationAttributes> implements MenuAttributes {
    seq!: number
    ctgSeq!: number
    name!: string
    abv?: string
    price!: number
    cmt?: string
    options?: string
    createdAt?: Date
    updatedAt?: Date

    static initModel(sequelize: Sequelize.Sequelize): typeof Menu {
        return sequelize.define(
            'Menu',
            {
                seq: {
                    autoIncrement: true,
                    type: DataTypes.BIGINT.UNSIGNED,
                    allowNull: false,
                    primaryKey: true,
                    comment: '메뉴 Seq',
                },
                ctgSeq: {
                    type: DataTypes.BIGINT.UNSIGNED,
                    allowNull: false,
                    comment: '메뉴 카테고리 Seq',
                },
                name: {
                    type: DataTypes.STRING(45),
                    allowNull: false,
                    comment: '메뉴 명',
                    unique: 'name',
                },
                abv: {
                    type: DataTypes.STRING(10),
                    allowNull: true,
                    comment: '이름 약어',
                },
                price: {
                    type: DataTypes.INTEGER.UNSIGNED,
                    allowNull: false,
                    comment: '가격',
                },
                cmt: {
                    type: DataTypes.STRING(1000),
                    allowNull: true,
                    comment: '비고',
                },
                options: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    comment: '추가정보',
                },
                createdAt: {
                    type: DataTypes.DATE,
                    allowNull: true,
                    defaultValue: Sequelize.Sequelize.fn('current_timestamp'),
                    comment: '생성시간',
                },
                updatedAt: {
                    type: DataTypes.DATE,
                    allowNull: true,
                    defaultValue: Sequelize.Sequelize.fn('current_timestamp'),
                    comment: '수정시간',
                },
            },
            {
                tableName: 'Menu',
                timestamps: false,
                indexes: [
                    {
                        name: 'PRIMARY',
                        unique: true,
                        using: 'BTREE',
                        fields: [{ name: 'seq' }],
                    },
                    {
                        name: 'name',
                        unique: true,
                        using: 'BTREE',
                        fields: [{ name: 'name' }],
                    },
                    {
                        name: 'FK_MenuCategory_TO_Menu',
                        using: 'BTREE',
                        fields: [{ name: 'ctgSeq' }],
                    },
                ],
            },
        ) as typeof Menu
    }
}
