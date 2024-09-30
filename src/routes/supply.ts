import { Router } from 'express'
import DB from '../models'
import Paths from '@src/common/Paths'
import HttpStatusCodes from '@src/common/HttpStatusCodes'
import { SupplyAttributes, SupplyCreationAttributes } from '@src/models/Supply'

const router = Router()
const { Supply } = DB.Models

router.get(Paths.Supply, async (req, res) => {
    const list = await Supply.findAll()

    return res.status(HttpStatusCodes.OK).send(list.map((item) => item.toJSON()))
})

router.post(Paths.Supply, async (req, res) => {
    const body = req.body as SupplyCreationAttributes
    const nSupply = await Supply.create(body)

    return res.status(HttpStatusCodes.CREATED).send(nSupply)
})

router.patch(`${Paths.Supply}/:seq`, async (req, res) => {
    const body = req.body as SupplyAttributes
    const seq = +req.params.seq

    const [uCnt] = await Supply.update(body, { where: { seq } })
    if (uCnt == 0) {
        res.sendStatus(HttpStatusCodes.BAD_REQUEST)
        return
    }

    const uSupply = await Supply.findOne({ where: { seq } })
    res.status(HttpStatusCodes.OK).send(uSupply!.toJSON())
})

router.delete(`${Paths.Supply}/:seq`, async (req, res) => {
    const seq = +req.params.seq

    const delCnt = await Supply.destroy({ where: { seq } })
    if (delCnt == 0) {
        res.sendStatus(HttpStatusCodes.BAD_REQUEST)
        return
    }

    res.sendStatus(HttpStatusCodes.NO_CONTENT)
})
