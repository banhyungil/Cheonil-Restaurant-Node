import HttpStatusCodes from '@src/common/HttpStatusCodes'
import { Codes, ResponseError } from '@src/common/ResponseError'
import DB from '@src/models'
import { ProductAttributes, ProductCreationAttributes } from '@src/models/Product'
import { Router } from 'express'
import { sum } from 'lodash'
const router = Router()

const { Product, ProductInfo, Unit } = DB.Models

router.get('/', async (req, res) => {
    const nMps = await Product.findAll({
        include: [
            {
                model: ProductInfo,
                as: 'product',
            },
            {
                model: Unit,
                as: 'unit',
            },
        ],
    })

    res.status(HttpStatusCodes.CREATED).send(nMps)
})

router.post('/batch-create', async (req, res) => {
    const body = req.body as ProductCreationAttributes[]
    const nMps = await Product.bulkCreate(body)

    res.status(HttpStatusCodes.CREATED).send(nMps)
})

router.delete('/productInfo/:prdInfoSeq', async (req, res) => {
    const prdInfoSeq = +req.params.prdInfoSeq
    const cnt = await Product.destroy({ where: { prdInfoSeq } })

    if (cnt == 0) {
        res.status(HttpStatusCodes.BAD_REQUEST).send(ResponseError.get(Codes.NOT_EXIST_ID))
        return
    }

    res.sendStatus(HttpStatusCodes.NO_CONTENT)
})

router.post('/batch-delete', async (req, res) => {
    const body = req.body as ProductAttributes[]
    const cnts = await Promise.all(body.map((mp) => Product.destroy({ where: { prdInfoSeq: mp.prdInfoSeq, unitSeq: mp.unitSeq } })))
    if (sum(cnts) == 0) {
        res.status(HttpStatusCodes.BAD_REQUEST).send({ ...ResponseError.get(Codes.NOT_EXIST_ID) })
        return
    }

    res.sendStatus(HttpStatusCodes.NO_CONTENT)
})

export default router
