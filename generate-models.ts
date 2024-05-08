import { SequelizeAuto } from 'sequelize-auto'
// const dbInfo = config.database.mariadb
const dbConfig = {
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'root',
    database: 'cheonildb',
    dialect: 'mysql',
    tables: ['UserInfo'], // 최소 예제를 위해 테이블 하나만
}

const sequelizeAuto = new SequelizeAuto(
    dbConfig.database,
    dbConfig.username,
    dbConfig.password,
    {
        host: dbConfig.host,
        port: dbConfig.port,
        dialect: dbConfig.dialect,
        directory: './src/models',
        singularize: true,
        useDefine: false,
        caseFile: 'p',
        caseModel: 'p',
        lang: 'ts',
    }
)

sequelizeAuto.run()
