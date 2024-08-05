/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */
// note

import SequelizeAuto, { AutoOptions } from 'sequelize-auto'
import config from './src/config/development'
import { OpenAPIV3 } from 'openapi-types'

/* eslint-disable */
const configDb = config.database

run()
async function run() {
    const auto = getSequelizeAuto()
    await auto.run()
}

function getSequelizeAuto(options?: Partial<AutoOptions>) {
    return  new SequelizeAuto(
        configDb.database,
        configDb.username,
        configDb.password,
        {
            host: configDb.host,
            port: configDb.port,
            spaces: true,
            indentation: 4,
            dialect: configDb.dialect,
            directory: './src/models', // where to write files
            singularize: false, // convert plural table names to singular model names
            additional: {
                timestamps: false,
                // ...options added to each model
            },
            caseFile: 'p',
            // caseModel: 'p',
            // caseProp: 'c',
            lang: 'ts',
            useDefine: true,
            

            // noInitModels: true,
            ...configDb,
            ...options,
        },
    )
}

function getProperty(dbColType: string) {
    const property = {} as { type: OpenAPIV3.NonArraySchemaObjectType; format: string }
    switch (dbColType) {
        case 'VARCHAR':
        case 'TEXT':
            property.type = 'string'
            break
        case 'INTEGER':
        case 'BIGINT':
            property.type = 'integer'
            break
        case 'BOOLEAN':
            property.type = 'boolean'
            break
        case 'DATE':
        case 'DATETIME':
        case 'TIMESTAMP':
            property.type = 'string'
            property.format = 'date-time'
            break
        default:
            property.type = 'string'
    }

    return property
}
