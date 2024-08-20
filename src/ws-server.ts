import WebSocket, { WebSocketServer } from 'ws'
import logger from 'jet-logger'
import EnvVars from './common/EnvVars'

const wss = new WebSocketServer({ port: +EnvVars.WsPort })

wss.on('error', console.error)

wss.on('open', function open(ws) {
    logger.info(`websoket open, port: ${+EnvVars.WsPort}`)
})

/**
 * @see https://www.npmjs.com/package/ws
 * Server broadcast
 */
wss.on('message', function message(data, isBinary) {
    broadcast(data)
})

export function broadcast(data: any) {
    wss.clients.forEach((cl) => {
        if (cl.readyState === WebSocket.OPEN) {
            cl.send(data)
        }
    })
}

export default wss
