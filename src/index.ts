import './pre-start' // Must be the first import
import logger from 'jet-logger'

import EnvVars from '@src/common/EnvVars'
import server from './server'
import express from 'express'
import { createWsServer } from './ws-server'

// **** Run **** //

const SERVER_START_MSG = 'Express server started on port: ' + EnvVars.Port.toString()

server.listen(EnvVars.Port, () => logger.info(SERVER_START_MSG))
const WsServer = express().listen(+EnvVars.WsPort, () => {
    logger.info('Express server started on port: ' + EnvVars.WsPort.toString())
})

export const WSS = createWsServer(WsServer)
