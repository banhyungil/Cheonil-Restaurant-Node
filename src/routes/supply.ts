import { Router } from 'express'
import DB from '../models'
import Paths from '@src/common/Paths'
import HttpStatusCodes from '@src/common/HttpStatusCodes'
import { SupplyAttributes, SupplyCreationAttributes } from '@src/models/Supply'
import { Codes, converNumRes, ResponseError } from '@src/common/ResponseError'

const router = Router()
const { Supply, Unit, MapSupplyUnit } = DB.Models

router.get('/', async (req, res) => {
    const list = await Supply.findAll({
        include: {
            as: 'units',
            model: Unit,
        },
    })

    return res.status(HttpStatusCodes.OK).send(list.map((item) => item.toJSON()))
})

router.get('/:seq', async (req, res) => {
    const seq = converNumRes(req.params.seq, res)
    const supply = await Supply.findOne({
        include: {
            as: 'units',
            model: Unit,
        },
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
    await MapSupplyUnit.bulkCreate(
        body.unitNms.map((nm) => {
            return {
                unitNm: nm,
                suplSeq: nSupply.seq,
            }
        }),
    )

    const resSupply = await Supply.findOne({
        include: {
            as: 'units',
            model: Unit,
        },
        where: { seq: nSupply.seq },
    })

    return res.status(HttpStatusCodes.CREATED).send(resSupply)
})

router.patch('/:seq', async (req, res) => {
    const body = req.body as { supply: SupplyCreationAttributes; unitNms: string[] }
    const seq = +req.params.seq
    if (isNaN(seq)) res.status(HttpStatusCodes.BAD_REQUEST).send(ResponseError.get(Codes.BAD_ROUTE_PARAM))

    await Supply.update(body.supply, { where: { seq } })
    await MapSupplyUnit.destroy({ where: { suplSeq: seq } })
    await MapSupplyUnit.bulkCreate(
        body.unitNms.map((nm) => {
            return {
                unitNm: nm,
                suplSeq: seq,
            }
        }),
    )

    const uSupply = await Supply.findOne({
        include: {
            as: 'units',
            model: Unit,
        },
        where: { seq },
    })
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
    await MapSupplyUnit.destroy({ where: { suplSeq: seq } })

    res.sendStatus(HttpStatusCodes.NO_CONTENT)
})

export default router
