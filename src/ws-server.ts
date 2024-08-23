import WebSocket, { Server, ServerOptions, WebSocketServer } from 'ws'
import logger from 'jet-logger'
import EnvVars from './common/EnvVars'

export function createWsServer(server: ServerOptions['server']) {
    const wss = new WebSocketServer({ server })

    wss.on('connection', (ws) => {
        ws.on('open', function open() {
            logger.info(`websoket open, port: ${+EnvVars.WsPort}`)
            logger.info(`clients length: ${Array.from(wss.clients).length}`)
        })

        ws.on('close', (code, reason) => {
            logger.info(`websoket close, ${code + reason.toString()}`)
        })

        ws.on('error', console.error)

        /**
         * @see https://www.npmjs.com/package/ws
         * Server broadcast
         */
        ws.on('message', function message(data, isBinary) {
            broadcast(wss, data)
        })
    })

    return wss
}

export function broadcast(wss: Server, data: any) {
    wss.clients.forEach((cl) => {
        if (cl.readyState === WebSocket.OPEN) {
            cl.send(data)
        }
    })
}
