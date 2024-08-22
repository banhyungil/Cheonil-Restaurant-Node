import Wss, { broadcast } from './ws-server'
import { responseHandler } from 'express-intercept'
import logger from 'jet-logger'

// 요청 CUD인 경우 메타정보와 함꼐 응답 내용을 broadcast해준다.
const Interceptor = responseHandler().getBuffer((body, req, res) => {
    if (req == null) return

    if (req.method == 'POST' || req.method == 'PATCH' || req.method == 'DELETE') {
        const { originalUrl, baseUrl, method } = req
        const sendData = {
            url: originalUrl,
            baseUrl,
            method,
            resBody: body.toString(),
            routeParams: req.params,
        }

        logger.info(`sendData: ${JSON.stringify(sendData)}`)
        Wss.clients.forEach((cl) => {
            broadcast(JSON.stringify(sendData))
        })
    }
})

export default Interceptor
