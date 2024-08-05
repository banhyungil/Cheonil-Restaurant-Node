import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface MenuAttributes {
    name: string;
    ctgNm: string;
    abv?: string;
    price: number;
    cmt?: string;
    options?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export type MenuPk = "name";
export type MenuId = Menu[MenuPk];
export type MenuOptionalAttributes = "abv" | "cmt" | "options" | "createdAt" | "updatedAt";
export type MenuCreationAttributes = Optional<MenuAttributes, MenuOptionalAttributes>;

export class Menu extends Model<MenuAttributes, MenuCreationAttributes> implements MenuAttributes {
    name!: string;
    ctgNm!: string;
    abv?: string;
    price!: number;
    cmt?: string;
    options?: string;
    createdAt?: Date;
    updatedAt?: Date;


    static initModel(sequelize: Sequelize.Sequelize): typeof Menu {
        return sequelize.define('Menu', {
        name: {
            type: DataTypes.STRING(45),
            allowNull: false,
            primaryKey: true,
            comment: "메뉴 명"
        },
        ctgNm: {
            type: DataTypes.STRING(20),
            allowNull: false,
            comment: "카테고리 명"
        },
        abv: {
            type: DataTypes.STRING(10),
            allowNull: true,
            comment: "이름 약어"
        },
        price: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            comment: "가격"
        },
        cmt: {
            type: DataTypes.STRING(1000),
            allowNull: true,
            comment: "비고"
        },
        options: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: "추가정보"
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: Sequelize.Sequelize.fn('current_timestamp'),
            comment: "생성시간"
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: Sequelize.Sequelize.fn('current_timestamp'),
            comment: "수정시간"
        }
    }, {
        tableName: 'Menu',
        timestamps: false,
        indexes: [
            {
                name: "PRIMARY",
                unique: true,
                using: "BTREE",
                fields: [
                    { name: "name" },
                ]
            },
            {
                name: "FK_MenuCategory_TO_Menu",
                using: "BTREE",
                fields: [
                    { name: "ctgNm" },
                ]
            },
            {
                name: "idx_ctgNm",
                using: "BTREE",
                fields: [
                    { name: "ctgNm" },
                ]
            },
        ]
    }) as typeof Menu;
    }
}
