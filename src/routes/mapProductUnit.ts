import HttpStatusCodes from '@src/common/HttpStatusCodes'
import { Codes, ResponseError } from '@src/common/ResponseError'
import DB from '@src/models'
import { MapProductUnitAttributes, MapProductUnitCreationAttributes } from '@src/models/MapProductUnit'
import { Router } from 'express'
import { sum } from 'lodash'
const router = Router()

const { MapProductUnit } = DB.Models
router.post('/batch-create', async (req, res) => {
    const body = req.body as MapProductUnitCreationAttributes[]

    const nMps = await MapProductUnit.bulkCreate(body)

    res.status(HttpStatusCodes.CREATED).send(nMps)
})

router.post('/batch-delete', async (req, res) => {
    const body = req.body as MapProductUnitAttributes[]
    const cnts = await Promise.all(body.map((mp) => MapProductUnit.destroy({ where: { prdSeq: mp.prdSeq, unitSeq: mp.unitSeq } })))
    if (sum(cnts) == 0) {
        res.status(HttpStatusCodes.BAD_REQUEST).send({ ...ResponseError.get(Codes.NOT_EXIST_ID) })
        return
    }

    res.sendStatus(HttpStatusCodes.NO_CONTENT)
})

export default router
