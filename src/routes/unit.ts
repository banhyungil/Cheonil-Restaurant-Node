import { Router } from 'express'
import DB from '../models'
import HttpStatusCodes from '@src/common/HttpStatusCodes'
import { Codes } from '@src/common/ResponseError'
import { UnitCreationAttributes } from '@src/models/Unit'

const router = Router()
const { Unit } = DB.Models

router.get('/', async (req, res) => {
    const list = await Unit.findAll()

    return res.status(HttpStatusCodes.OK).send(list.map((item) => item.toJSON()))
})

router.post('/', async (req, res) => {
    const body = req.body as UnitCreationAttributes
    const nUnit = await Unit.create(body)

    return res.status(HttpStatusCodes.CREATED).send(nUnit)
})

router.delete('/:name', async (req, res) => {
    const name = req.params.name

    const delCnt = await Unit.destroy({ where: { name } })
    if (delCnt == 0) {
        res.status(HttpStatusCodes.BAD_REQUEST).send(Codes.NOT_EXIST_ID)
        return
    }

    res.sendStatus(HttpStatusCodes.NO_CONTENT)
})

export default router
