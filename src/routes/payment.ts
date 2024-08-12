import { PaymentAttributes, PaymentCreationAttributes } from '@src/models/Payment'
import express from 'express'
import DB from '@src/models'
import HttpStatusCodes from '@src/common/HttpStatusCodes'
import { Op } from 'sequelize'

const router = express.Router()
const { Payment } = DB.models

router.post('/', async (req, res) => {
    const body = req.body as PaymentCreationAttributes

    const nPayment = await Payment.create(body)

    res.status(HttpStatusCodes.CREATED).send(nPayment.toJSON())
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
    const seqs = req.body as PaymentAttributes['seq'][]

    const delCnt = await Payment.destroy({
        where: {
            seq: {
                [Op.in]: seqs,
            },
        },
    })

    if (delCnt == 0) {
        res.sendStatus(HttpStatusCodes.BAD_REQUEST)
        return
    }

    res.sendStatus(HttpStatusCodes.NO_CONTENT)
})

export default router
