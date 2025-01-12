import { Router } from 'express'
import DB from '../models'
import HttpStatusCodes from '@src/common/HttpStatusCodes'
import { Codes, converNumRes, ResponseError } from '@src/common/ResponseError'
import { ProductInfoAttributes, ProductInfoCreationAttributes } from '@src/models/ProductInfo'

const router = Router()
const { ProductInfo, Product, Unit } = DB.Models

router.get('/', async (req, res) => {
    const list = await ProductInfo.findAll({
        include: [
            {
                as: 'products',
                model: Product,
                include: [{ model: Unit, as: 'unit' }],
            },
        ],
    })

    return res.status(HttpStatusCodes.OK).send(list.map((item) => item.toJSON()))
})

router.get('/:seq', async (req, res) => {
    const seq = converNumRes(req.params.seq, res)
    const productInfo = await ProductInfo.findOne({
        include: {
            as: 'products',
            model: Product,
            include: [{ model: Unit, as: 'unit' }],
        },
        where: { seq },
    })
    if (productInfo == null) {
        res.status(HttpStatusCodes.BAD_REQUEST).send(ResponseError.get(Codes.NOT_EXIST_ID))
        return
    }

    return res.status(HttpStatusCodes.OK).send(productInfo.toJSON())
})

router.post('/', async (req, res) => {
    const productInfo = req.body as ProductInfoCreationAttributes
    const nProduct = await ProductInfo.create(productInfo)

    return res.status(HttpStatusCodes.CREATED).send(nProduct)
})

router.patch('/:seq', async (req, res) => {
    const productInfo = req.body as ProductInfoAttributes
    const seq = +req.params.seq

    /** validate */
    if (isNaN(seq)) {
        res.status(HttpStatusCodes.BAD_REQUEST).send(ResponseError.get(Codes.BAD_ROUTE_PARAM))
        return
    }
    const originProduct = await ProductInfo.findOne({ where: { seq: productInfo.seq } })
    if (originProduct == null) {
        res.status(HttpStatusCodes.BAD_REQUEST).send(ResponseError.get(Codes.BAD_ROUTE_PARAM))
        return
    }
    /** validate */

    await ProductInfo.update(productInfo, { where: { seq } })
    const uProduct = await ProductInfo.findOne({
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

    const delCnt = await ProductInfo.destroy({ where: { seq } })
    if (delCnt == 0) {
        res.status(HttpStatusCodes.BAD_REQUEST).send(Codes.NOT_EXIST_ID)
        return
    }
    await Product.destroy({ where: { prdInfoSeq: seq } })

    res.sendStatus(HttpStatusCodes.NO_CONTENT)
})

export default router
