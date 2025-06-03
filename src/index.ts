import './pre-start' // Must be the first import
import './models'
import logger from 'jet-logger'

import EnvVars from '@src/common/EnvVars'
import app from './server'
import { createWsServer } from './ws-server'
import DbService from './services/DbService'

// **** Run **** //
DbService.init()

const SERVER_START_MSG = 'Express server started on port: ' + EnvVars.Port.toString()

const server = app.listen(EnvVars.Port, () => logger.info(SERVER_START_MSG))

export const WSS = createWsServer(server)
