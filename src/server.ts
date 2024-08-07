/**
 * Setup express server.
 */

// router보다 항상위에 위치! 모델이 생성된뒤에 다른곳에서 참조되어야함
import Db from './models'

import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import path from 'path'
import helmet from 'helmet'
import express, { Request, Response, NextFunction } from 'express'
import logger from 'jet-logger'

import 'express-async-errors'

import BaseRouter from '@src/routes'

import Paths from '@src/common/Paths'
import EnvVars from '@src/common/EnvVars'
import HttpStatusCodes from '@src/common/HttpStatusCodes'
import RouteError from '@src/common/RouteError'
import { NodeEnvs } from '@src/common/misc'
import swaggerUi from 'swagger-ui-express'
import { readFileSync } from 'fs'
import Yaml from 'js-yaml'

// **** Variables **** //
Db.init()

const app = express()

// **** Setup **** //

// Basic middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser(EnvVars.CookieProps.Secret))

// Show routes called in console during development
if (EnvVars.NodeEnv === NodeEnvs.Dev.valueOf()) {
    app.use(morgan('dev'))
}

// Security
// if (EnvVars.NodeEnv === NodeEnvs.Production.valueOf()) {
//   app.use(helmet());
// }

// Add APIs, must be after middleware
app.use(Paths.Base, BaseRouter)

// Add error handler
app.use(
    (
        err: Error,
        _: Request,
        res: Response,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        next: NextFunction,
    ) => {
        if (EnvVars.NodeEnv !== NodeEnvs.Test.valueOf()) {
            logger.err(err, true)
        }
        let status = HttpStatusCodes.BAD_REQUEST
        if (err instanceof RouteError) {
            status = err.status
        }
        return res.status(status).json({ error: err.message })
    },
)

// **** Front-End Content **** //
const oasYaml = readFileSync(path.join(__dirname, '../openapi/openapi.yaml'), { encoding: 'utf-8' })
const oOas = Yaml.load(oasYaml) as object
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(oOas))

// **** Export default **** //

export default app
