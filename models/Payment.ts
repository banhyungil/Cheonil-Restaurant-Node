import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface PaymentAttributes {
  id: number;
  payDate?: Date;
  created?: Date;
  updated?: Date;
}

export type PaymentPk = "id";
export type PaymentId = Payment[PaymentPk];
export type PaymentOptionalAttributes = "id" | "payDate" | "created" | "updated";
export type PaymentCreationAttributes = Optional<PaymentAttributes, PaymentOptionalAttributes>;

export class Payment extends Model<PaymentAttributes, PaymentCreationAttributes> implements PaymentAttributes {
  id!: number;
  payDate?: Date;
  created?: Date;
  updated?: Date;


  static initModel(sequelize: Sequelize.Sequelize): typeof Payment {
    return Payment.init({
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    payDate: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "실제 대금 납부일"
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
    tableName: 'payment',
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
