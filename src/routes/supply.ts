import { Router } from 'express'
import DB from '../models'
import HttpStatusCodes from '@src/common/HttpStatusCodes'
import { SupplyCreationAttributes } from '@src/models/Supply'
import { Codes, converNumRes, ResponseError } from '@src/common/ResponseError'

const router = Router()
const { Supply, ProductInfo } = DB.Models

router.get('/', async (req, res) => {
    const list = await Supply.findAll()

    return res.status(HttpStatusCodes.OK).send(list.map((item) => item.toJSON()))
})

router.get('/:seq', async (req, res) => {
    const seq = converNumRes(req.params.seq, res)
    const supply = await Supply.findOne({
        where: { seq },
    })
    if (supply == null) {
        res.status(HttpStatusCodes.BAD_REQUEST).send(ResponseError.get(Codes.NOT_EXIST_ID))
        return
    }

    return res.status(HttpStatusCodes.OK).send(supply.toJSON())
})

router.post('/', async (req, res) => {
    const body = req.body as { supply: SupplyCreationAttributes; unitNms: string[] }
    const nSupply = await Supply.create(body.supply)

    const resSupply = await Supply.findOne({
        where: { seq: nSupply.seq },
    })

    return res.status(HttpStatusCodes.CREATED).send(resSupply)
})

router.patch('/:seq', async (req, res) => {
    const body = req.body as { supply: SupplyCreationAttributes; unitNms: string[] }
    const seq = +req.params.seq
    if (isNaN(seq)) {
        res.status(HttpStatusCodes.BAD_REQUEST).send(ResponseError.get(Codes.BAD_ROUTE_PARAM))
        return
    }

    await Supply.update(body.supply, { where: { seq } })

    const uSupply = await Supply.findOne({
        where: { seq },
    })
    if (uSupply == null) {
        res.status(HttpStatusCodes.BAD_REQUEST).send(ResponseError.get(Codes.NOT_EXIST_ID))
        return
    }

    res.status(HttpStatusCodes.OK).send(uSupply.toJSON())
})

router.delete('/:seq', async (req, res) => {
    const seq = +req.params.seq
    if (isNaN(seq)) res.status(HttpStatusCodes.BAD_REQUEST).send(ResponseError.get(Codes.BAD_ROUTE_PARAM))

    const cnt = await ProductInfo.count({ where: { suplSeq: seq } })
    if (cnt > 0) {
        res.status(HttpStatusCodes.BAD_REQUEST).send({ ...ResponseError.get(Codes.BAD_BODY), message: '등록된 제품이 존재합니다.' })
        return
    }

    const delCnt = await Supply.destroy({ where: { seq } })
    if (delCnt == 0) {
        res.status(HttpStatusCodes.BAD_REQUEST).send(Codes.NOT_EXIST_ID)
        return
    }

    res.sendStatus(HttpStatusCodes.NO_CONTENT)
})

export default router
