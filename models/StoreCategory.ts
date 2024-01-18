import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface StoreCategoryAttributes {
  id: number;
  name: string;
  created?: Date;
  updated?: Date;
}

export type StoreCategoryPk = "id";
export type StoreCategoryId = StoreCategory[StoreCategoryPk];
export type StoreCategoryOptionalAttributes = "created" | "updated";
export type StoreCategoryCreationAttributes = Optional<StoreCategoryAttributes, StoreCategoryOptionalAttributes>;

export class StoreCategory extends Model<StoreCategoryAttributes, StoreCategoryCreationAttributes> implements StoreCategoryAttributes {
  id!: number;
  name!: string;
  created?: Date;
  updated?: Date;


  static initModel(sequelize: Sequelize.Sequelize): typeof StoreCategory {
    return StoreCategory.init({
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(40),
      allowNull: false
    },
    created: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updated: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'store_category',
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
