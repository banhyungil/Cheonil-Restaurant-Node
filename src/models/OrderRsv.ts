import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface OrderRsvAttributes {
    seq: number;
    storeNm: string;
    amount: number;
    rsvTime: string;
    dayType?: 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN';
    cmt?: string;
    options?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export type OrderRsvPk = "seq";
export type OrderRsvId = OrderRsv[OrderRsvPk];
export type OrderRsvOptionalAttributes = "seq" | "dayType" | "cmt" | "options" | "createdAt" | "updatedAt";
export type OrderRsvCreationAttributes = Optional<OrderRsvAttributes, OrderRsvOptionalAttributes>;

export class OrderRsv extends Model<OrderRsvAttributes, OrderRsvCreationAttributes> implements OrderRsvAttributes {
    seq!: number;
    storeNm!: string;
    amount!: number;
    rsvTime!: string;
    dayType?: 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN';
    cmt?: string;
    options?: string;
    createdAt?: Date;
    updatedAt?: Date;


    static initModel(sequelize: Sequelize.Sequelize): typeof OrderRsv {
        return sequelize.define('OrderRsv', {
        seq: {
            autoIncrement: true,
            type: DataTypes.BIGINT.UNSIGNED,
            allowNull: false,
            primaryKey: true,
            comment: "주문예약 Seq"
        },
        storeNm: {
            type: DataTypes.STRING(45),
            allowNull: false,
            comment: "매장 명"
        },
        amount: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            comment: "총 금액"
        },
        rsvTime: {
            type: DataTypes.CHAR(5),
            allowNull: false,
            comment: "HH:MM"
        },
        dayType: {
            type: DataTypes.ENUM('MON','TUE','WED','THU','FRI','SAT','SUN'),
            allowNull: true,
            comment: "요일"
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
        tableName: 'OrderRsv',
        timestamps: false,
        indexes: [
            {
                name: "PRIMARY",
                unique: true,
                using: "BTREE",
                fields: [
                    { name: "seq" },
                ]
            },
            {
                name: "FK_Store_TO_OrderRsv",
                using: "BTREE",
                fields: [
                    { name: "storeNm" },
                ]
            },
            {
                name: "idx_storeNm",
                using: "BTREE",
                fields: [
                    { name: "storeNm" },
                ]
            },
        ]
    }) as typeof OrderRsv;
    }
}
