import { SequelizeAuto } from 'sequelize-auto'
// import fs from 'fs'
// import path from 'path'

// const dbInfo = config.database.mariadb
const dbConfig = {
    host: '127.0.0.1',
    port: 3306,
    username: 'root',
    password: 'root',
    database: 'cheonildb',
    dialect: 'mysql',
    // ****test
    // tables: ['UserInfo'], // 최소 예제를 위해 테이블 하나만
    // ****test
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
        // caseModel: 'p',
        lang: 'ts',
    }
)

sequelizeAuto.run().then(() => {
    // 현재 디렉토리 파일 목록 추출
    // const files = fs.readdirSync(path.join(__dirname, './models'), {
    //     withFileTypes: true,
    // })
    // const exceptList = ['index.js', 'init-models.js']
    // files.forEach(async (file) => {
    //     if (exceptList.includes(file.name)) return
    //     const fileText = fs.readFileSync(path.join(file.path, file.name))
    // })
})
