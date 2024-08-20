import app from './server'
import Wss, { broadcast } from './ws-server'
import { responseHandler } from 'express-intercept'

app.use()

// 요청 CUD인 경우 메타정보와 함꼐 응답 내용을 broadcast해준다.
responseHandler().interceptStream((upstream, req, _) => {
    if (req.method == 'POST' || req.method == 'PATCH' || req.method == 'DELETE') {
        const { url, baseUrl, method } = req
        Wss.clients.forEach((cl) => {
            broadcast({
                url,
                baseUrl,
                method,
                resBody: upstream,
            })
        })
    }

    return upstream
})
