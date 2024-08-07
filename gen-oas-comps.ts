import fs from 'fs'
import path from 'path'
import { OpenAPIV3 } from 'openapi-types'
import YAML from 'js-yaml'
import _ from 'lodash'
import SequelizeAuto, { AutoOptions } from 'sequelize-auto'
import config from './src/config/development'

const configDb = config.database
const auto = getSequelizeAuto({ noWrite: true })

run()

interface TableColumnMeta {
    allowNull: boolean
    autoIncrement: boolean
    comment: string
    defaultValue: any
    foreignKey: {
        constraint_name: string
        source_schema: string
        source_table: string
        source_column: string
        target_schema: string | null
        target_table?: string | null // 'target_table' 속성 추가
        target_column?: string | null // 'target_column' 속성 추가
    }
    primaryKey: boolean
    type: string
}

async function run() {
    await auto
        .run()
        .then((data) => {
            const oComponents = {
                schemas: {},
            } as OpenAPIV3.ComponentsObject

            /* eslint-disable @typescript-eslint/no-unsafe-assignment */
            Object.entries(data.tables).forEach(([_tableName, colInfo]) => {
                const tableName = _tableName.replace('public.', '')
                const properties = {} as OpenAPIV3.SchemaObject['properties']
                const serverCols = ['createdBy', 'updatedBy', 'createdAt', 'updatedAt']

                // properties 생성
                Object.entries(colInfo).forEach(([_colName, _colMeta]) => {
                    const colMeta = _colMeta as TableColumnMeta
                    const colName = snakeToCamel(_colName)
                    properties![colName] = {
                        description: colMeta.comment ?? '',
                        ...getProperty(colMeta.type),
                    }
                })

                // 테이블 schema 생성
                // snake -> Pascal
                const schema = camelToPascal(snakeToCamel(tableName))

                const propKeys = Object.keys(properties!)

                // serverCols가 있는 경우면 schema 2개를 분리
                if (serverCols.some((col) => propKeys.includes(col))) {
                    // serverColumn 제외
                    oComponents.schemas![`${schema}NSC`] = {
                        type: 'object',
                        properties: _.cloneDeep(_.omit(properties, serverCols)),
                    }

                    oComponents.schemas![schema] = {
                        allOf: [
                            {
                                $ref: `#/components/schemas/${schema}NSC`,
                            },
                            {
                                type: 'object',
                                properties: _.cloneDeep(_.pick(properties, serverCols)) as never,
                            },
                        ],
                    }
                } else {
                    oComponents.schemas![`${schema}`] = {
                        type: 'object',
                        properties,
                    }
                }
            })
            // yaml -> js
            const yamlPath = path.join(__dirname, './openapi/openapi.yaml')
            const oOas = YAML.load(fs.readFileSync(yamlPath, 'utf-8')) as OpenAPIV3.Document
            // * components 교체
            oOas.components!.schemas = oComponents.schemas

            // js -> yaml
            fs.writeFileSync(yamlPath, YAML.dump(oOas), 'utf-8')
        })
        .catch((err) => {
            console.error('Error:', err)
        })
}

function snakeToCamel(snake: string): string {
    return snake.replace(/(_\w)/g, (matches) => matches[1].toUpperCase())
}

function camelToPascal(camel: string) {
    if (!camel) return camel // 빈 문자열 처리
    return camel[0].toUpperCase() + camel.slice(1)
}

function getSequelizeAuto(options?: Partial<AutoOptions>) {
    return new SequelizeAuto(configDb.database, configDb.username, configDb.password, {
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
        caseModel: 'p',
        caseProp: 'c',
        lang: 'ts',
        useDefine: true,

        // noInitModels: true,
        ...configDb,
        ...options,
    })
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
