import { ConnectionError, ConnectionTimedOutError, Options, TimeoutError } from 'sequelize'
import { SignOptions } from 'jsonwebtoken'
import EnvVars from '../common/EnvVars'
type RequiredK<T extends object, K extends keyof T> = Required<Pick<T, K>> & Omit<T, K>

const db: RequiredK<Options, 'username' | 'database' | 'password'> = {
    host: EnvVars.Db.Host,
    port: +EnvVars.Db.Port,
    database: EnvVars.Db.Name,
    username: EnvVars.Db.User,
    password: EnvVars.Db.Pwd,
    dialect: 'mysql',
    timezone: '+09:00',
    // schema: 'public',
    quoteIdentifiers: true,
    dialectOptions: {
        dateStrings: 'true',
        typeCast: 'true',
        multipleStatements: true,
    },
    retry: {
        match: [ConnectionError, ConnectionTimedOutError, TimeoutError, /Deadlock/i, 'SQLITE_BUSY'],
        max: 3,
    },
    benchmark: true,
    logQueryParameters: true,
    pool: {
        max: 50,
        min: 0,
    },
}

const config = {
    log: {
        path: `${__dirname}/../log`,
    },
    secret: {
        secretKey: 'secretStage',
        accessTokenOption: {
            algorithm: 'HS512',
            expiresIn: '30d',
            // test token
            // expiresIn: '10s',
            issuer: 'https://xm-union-manage',
        } as SignOptions,
        refreshTokenOption: {
            algorithm: 'HS512',
            expiresIn: '60d',
            // test token
            // expiresIn: '30s',
            issuer: 'https://xm-union-manage',
        } as SignOptions,
        passwordSalt: 'nicetcm!@#!@#',
    },
    db,
}
export type MyConfig = typeof config

export default config
