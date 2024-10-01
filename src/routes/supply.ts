import { Router } from 'express'
import DB from '../models'
import Paths from '@src/common/Paths'
import HttpStatusCodes from '@src/common/HttpStatusCodes'
import { SupplyAttributes, SupplyCreationAttributes } from '@src/models/Supply'
import { Codes, ResponseError } from '@src/common/ResponseError'

const router = Router()
const { Supply } = DB.Models

router.get('/', async (req, res) => {
    const list = await Supply.findAll()

    return res.status(HttpStatusCodes.OK).send(list.map((item) => item.toJSON()))
})

router.post('/', async (req, res) => {
    const body = req.body as SupplyCreationAttributes
    const nSupply = await Supply.create(body)

    return res.status(HttpStatusCodes.CREATED).send(nSupply)
})

router.patch('/:seq', async (req, res) => {
    const body = req.body as SupplyAttributes
    const seq = +req.params.seq
    if (isNaN(seq)) res.status(HttpStatusCodes.BAD_REQUEST).send(ResponseError.get(Codes.BAD_ROUTE_PARAM))

    const [uCnt] = await Supply.update(body, { where: { seq } })
    if (uCnt == 0) res.status(HttpStatusCodes.BAD_REQUEST).send(ResponseError.get(Codes.NOT_EXIST_ID))

    const uSupply = await Supply.findOne({ where: { seq } })
    res.status(HttpStatusCodes.OK).send(uSupply!.toJSON())
})

router.delete('/:seq', async (req, res) => {
    const seq = +req.params.seq
    if (isNaN(seq)) res.status(HttpStatusCodes.BAD_REQUEST).send(ResponseError.get(Codes.BAD_ROUTE_PARAM))

    const delCnt = await Supply.destroy({ where: { seq } })
    if (delCnt == 0) {
        res.status(HttpStatusCodes.BAD_REQUEST).send(Codes.NOT_EXIST_ID)
        return
    }

    res.sendStatus(HttpStatusCodes.NO_CONTENT)
})

export default router
