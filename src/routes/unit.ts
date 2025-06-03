import { Router } from 'express'
import { Models } from '../models'
import HttpStatusCodes from '@src/common/HttpStatusCodes'
import { Codes, ResponseError } from '@src/common/ResponseError'
import { UnitCreationAttributes } from '@src/models/Unit'

const router = Router()
const { Unit } = Models

router.get('/', async (req, res) => {
    const list = await Unit.findAll()

    return res.status(HttpStatusCodes.OK).send(list.map((item) => item.toJSON()))
})

router.post('/', async (req, res) => {
    const body = req.body as UnitCreationAttributes
    const nUnit = await Unit.create(body)

    return res.status(HttpStatusCodes.CREATED).send(nUnit)
})

router.patch('/:seq', async (req, res) => {
    const seq = +req.params.seq
    const body = req.body as UnitCreationAttributes
    await Unit.update(body, { where: { seq } })
    const uUnit = await Unit.findOne({ where: { seq }, raw: true })
    if (uUnit == null) {
        res.status(HttpStatusCodes.BAD_REQUEST).send(ResponseError.get(Codes.NOT_EXIST_ID))
        return
    }

    return res.status(HttpStatusCodes.OK).send(uUnit)
})

router.delete('/:seq', async (req, res) => {
    const seq = req.params.seq

    const delCnt = await Unit.destroy({ where: { seq } })
    if (delCnt == 0) {
        res.status(HttpStatusCodes.BAD_REQUEST).send(ResponseError.get(Codes.NOT_EXIST_ID))
        return
    }

    res.sendStatus(HttpStatusCodes.NO_CONTENT)
})

export default router
