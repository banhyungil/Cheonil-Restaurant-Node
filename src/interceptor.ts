import Wss, { broadcast } from './ws-server'
import { responseHandler } from 'express-intercept'
import logger from 'jet-logger'
import HttpStatusCodes from './common/HttpStatusCodes'

// 요청 CUD인 경우 메타정보와 함꼐 응답 내용을 broadcast해준다.
const Interceptor = responseHandler().replaceBuffer((body, req, res) => {
    const statusCode = res?.statusCode ?? 0
    if (req == null || (statusCode >= 200 && statusCode < 300) == false) return body

    /* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-return */
    const resBody = (() => {
        try {
            return JSON.parse(body.toString())
        } catch (err) {
            logger.err(err)
            return null
        }
    })()
    /* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-return */

    if (resBody) {
        const DEL_COLS = ['createdAt', 'updatedAt']
        deleteCols(resBody, DEL_COLS)
    }

    if (req.method == 'POST' || req.method == 'PATCH' || req.method == 'DELETE') {
        const { originalUrl, baseUrl, method } = req
        const sendData = {
            url: originalUrl,
            baseUrl,
            method,
            resBody,
            routeParams: req.params,
        }

        logger.info(`sendData: ${JSON.stringify(sendData)}`)
        Wss.clients.forEach((cl) => {
            broadcast(JSON.stringify(sendData))
        })
    }

    return resBody == null ? body : Buffer.from(JSON.stringify(resBody))
})

function deleteCols(data: any, cols: string[]) {
    if (Array.isArray(data)) {
        data.forEach((item) => deleteCols(item, cols))
    } else if (typeof data == 'object') {
        /* eslint-disable @typescript-eslint/no-unsafe-member-access */
        cols.forEach((col) => {
            if (col in data) delete data[col]
        })
        /* eslint-enable @typescript-eslint/no-unsafe-member-access */
    }
}

export default Interceptor
