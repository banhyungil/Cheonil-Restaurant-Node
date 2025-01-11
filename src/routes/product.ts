import { Router } from 'express'
import DB from '../models'
import HttpStatusCodes from '@src/common/HttpStatusCodes'
import { ProductAttributes, ProductCreationAttributes } from '@src/models/Product'
import { Codes, converNumRes, ResponseError } from '@src/common/ResponseError'

const router = Router()
const { Product, Unit, MapProductUnit } = DB.Models

router.get('/', async (req, res) => {
    const list = await Product.findAll({
        include: {
            as: 'units',
            model: Unit,
        },
    })

    return res.status(HttpStatusCodes.OK).send(list.map((item) => item.toJSON()))
})

router.get('/:seq', async (req, res) => {
    const seq = converNumRes(req.params.seq, res)
    const product = await Product.findOne({
        include: {
            as: 'units',
            model: Unit,
        },
        where: { seq },
    })
    if (product == null) {
        res.status(HttpStatusCodes.BAD_REQUEST).send(ResponseError.get(Codes.NOT_EXIST_ID))
        return
    }

    return res.status(HttpStatusCodes.OK).send(product.toJSON())
})

router.post('/', async (req, res) => {
    const product = req.body as ProductCreationAttributes
    const nProduct = await Product.create(product)

    return res.status(HttpStatusCodes.CREATED).send(nProduct)
})

router.patch('/:seq', async (req, res) => {
    const product = req.body as ProductAttributes
    const seq = +req.params.seq

    /** validate */
    if (isNaN(seq)) {
        res.status(HttpStatusCodes.BAD_REQUEST).send(ResponseError.get(Codes.BAD_ROUTE_PARAM))
        return
    }
    const originProduct = await Product.findOne({ where: { seq: product.seq } })
    if (originProduct == null) {
        res.status(HttpStatusCodes.BAD_REQUEST).send(ResponseError.get(Codes.BAD_ROUTE_PARAM))
        return
    }
    /** validate */

    await Product.update(product, { where: { seq } })
    const uProduct = await Product.findOne({
        where: { seq },
    })

    if (uProduct == null) {
        res.status(HttpStatusCodes.BAD_REQUEST).send(ResponseError.get(Codes.NOT_EXIST_ID))
        return
    }

    res.status(HttpStatusCodes.OK).send(uProduct.toJSON())
})

router.delete('/:seq', async (req, res) => {
    const seq = +req.params.seq
    if (isNaN(seq)) res.status(HttpStatusCodes.BAD_REQUEST).send(ResponseError.get(Codes.BAD_ROUTE_PARAM))

    const delCnt = await Product.destroy({ where: { seq } })
    if (delCnt == 0) {
        res.status(HttpStatusCodes.BAD_REQUEST).send(Codes.NOT_EXIST_ID)
        return
    }
    await MapProductUnit.destroy({ where: { prdSeq: seq } })

    res.sendStatus(HttpStatusCodes.NO_CONTENT)
})

export default router
