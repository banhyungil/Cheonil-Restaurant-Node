import { PaymentAttributes, PaymentCreationAttributes } from '@src/models/Payment'
import express from 'express'
import DB from '@src/models'
import HttpStatusCodes from '@src/common/HttpStatusCodes'
import { Op } from 'sequelize'
import { Codes, ResponseError } from '@src/common/ResponseError'

const router = express.Router()
const { Payment, MyOrder } = DB.Models

router.post('/', async (req, res) => {
    const body = req.body as PaymentCreationAttributes

    const order = await MyOrder.findOne({ where: { seq: body.orderSeq } })
    if (order == null) {
        res.status(HttpStatusCodes.BAD_REQUEST).send(ResponseError.getBadBody(['orderSeq']))
        return
    }
    const nPayment = await Payment.create(body)
    order.status = 'PAID'
    order.save()
    res.status(HttpStatusCodes.CREATED).send({ payment: nPayment.toJSON(), order: order.toJSON() })
})

router.patch('/:seq', async (req, res) => {
    const body = req.body as PaymentAttributes
    const seq = +req.params.seq

    const [uCnt] = await Payment.update(body, { where: { seq } })
    if (uCnt == 0) {
        res.sendStatus(HttpStatusCodes.BAD_REQUEST)
        return
    }

    const uPayment = await Payment.findOne({ where: { seq } })
    res.status(HttpStatusCodes.OK).send(uPayment?.toJSON())
})

router.post('/batch/delete', async (req, res) => {
    const payemnts = req.body as PaymentAttributes[]

    const delCnt = await Payment.destroy({
        where: {
            seq: {
                [Op.in]: payemnts.map((p) => p.seq),
            },
        },
    })

    if (delCnt == 0) {
        res.status(HttpStatusCodes.BAD_REQUEST).send(ResponseError.get(Codes.NOT_EXIST_ID))
        return
    }

    const uOrders = await MyOrder.findAll({ where: { seq: { [Op.in]: payemnts.map((p) => p.orderSeq) } } })
    await Promise.all(
        uOrders.map((od) => {
            od.status = 'COOKED'
            return od.save()
        }),
    )

    res.status(HttpStatusCodes.OK).send({ orders: uOrders.map((od) => od.toJSON()) })
})

export default router
