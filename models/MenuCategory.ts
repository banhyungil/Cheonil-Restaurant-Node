import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface MenuCategoryAttributes {
  id: number;
  name: string;
  created?: Date;
  updated?: Date;
}

export type MenuCategoryPk = "id";
export type MenuCategoryId = MenuCategory[MenuCategoryPk];
export type MenuCategoryOptionalAttributes = "id" | "created" | "updated";
export type MenuCategoryCreationAttributes = Optional<MenuCategoryAttributes, MenuCategoryOptionalAttributes>;

export class MenuCategory extends Model<MenuCategoryAttributes, MenuCategoryCreationAttributes> implements MenuCategoryAttributes {
  id!: number;
  name!: string;
  created?: Date;
  updated?: Date;


  static initModel(sequelize: Sequelize.Sequelize): typeof MenuCategory {
    return MenuCategory.init({
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    created: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updated: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'menu_category',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
