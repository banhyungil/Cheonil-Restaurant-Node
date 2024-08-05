import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface PlaceCategoryAttributes {
    name: string;
    cmt?: string;
    options?: string;
}

export type PlaceCategoryPk = "name";
export type PlaceCategoryId = PlaceCategory[PlaceCategoryPk];
export type PlaceCategoryOptionalAttributes = "cmt" | "options";
export type PlaceCategoryCreationAttributes = Optional<PlaceCategoryAttributes, PlaceCategoryOptionalAttributes>;

export class PlaceCategory extends Model<PlaceCategoryAttributes, PlaceCategoryCreationAttributes> implements PlaceCategoryAttributes {
    name!: string;
    cmt?: string;
    options?: string;


    static initModel(sequelize: Sequelize.Sequelize): typeof PlaceCategory {
        return sequelize.define('PlaceCategory', {
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            primaryKey: true,
            comment: "장소 카테고리 명"
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
        }
    }, {
        tableName: 'PlaceCategory',
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
        ]
    }) as typeof PlaceCategory;
    }
}
