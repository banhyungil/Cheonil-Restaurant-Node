#!/usr/bin/env node

/**
 * Module dependencies.
 */
import app from './app'
import http from 'http'
import _debug from 'debug' // console log를 예쁘게 남겨준다.
const debug = _debug('cheonil-restaurant-node:server')

/**
 * Get port from environment and store in Express.
 */
const port = normalizePort(process.env.PORT || '3000')
app.set('port', port)

/**
 * Create HTTP server.
 */
const server = http.createServer(app)

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port)
server.on('error', onError)
server.on('listening', onListening)

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val: string) {
    const port = parseInt(val, 10)

    if (isNaN(port)) {
        // named pipe
        return val
    }

    if (port >= 0) {
        // port number
        return port
    }

    return false
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error: Error) {
    const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port

    console.log(error)
    console.log(bind)
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    const addr = server.address()!
    const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port
    debug('Listening on ' + bind)
}
