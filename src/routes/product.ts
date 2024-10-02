import Paths from '@src/common/Paths'
import { Router } from 'express'
import DB from '../models'
import HttpStatusCodes from '@src/common/HttpStatusCodes'
import { ProductAttributes, ProductCreationAttributes } from '@src/models/Product'
import SupplyService from '@src/services/SupplyService'
import { Codes, converNumRes, ResponseError } from '@src/common/ResponseError'

const router = Router()
const { Product } = DB.Models

router.get('/', async (req, res) => {
    const products = await Product.findAll({ include: 'supply' })

    return res.status(HttpStatusCodes.OK).send(products.map((item) => item.toJSON()))
})

router.get('/:seq', async (req, res) => {
    const seq = converNumRes(req.params.seq, res)
    const product = await Product.findOne({ where: { seq } })
    if (product == null) {
        res.status(HttpStatusCodes.BAD_REQUEST).send(ResponseError.get(Codes.NOT_EXIST_ID))
        return
    }

    return res.status(HttpStatusCodes.OK).send(product.toJSON())
})

router.post('/', async (req, res) => {
    const body = req.body as ProductCreationAttributes
    const result = await SupplyService.updateUnitList(body.splSeq, body.unit, body.unitCnt)
    if (result == null) {
        res.status(HttpStatusCodes.BAD_REQUEST).send(ResponseError.getBadBody(['splSeq']))
        return
    }

    const nProduct = await Product.create(body)

    return res.status(HttpStatusCodes.CREATED).send({ supply: result.supply.toJSON(), product: nProduct.toJSON() })
})

router.patch('/:seq', async (req, res) => {
    const body = req.body as ProductAttributes
    const seq = +req.params.seq
    // validation
    if (isNaN(seq)) res.status(HttpStatusCodes.BAD_REQUEST).send(ResponseError.get(Codes.BAD_ROUTE_PARAM))

    const [uCnt] = await Product.update(body, { where: { seq } })
    if (uCnt == 0) res.status(HttpStatusCodes.BAD_REQUEST).send(ResponseError.get(Codes.NOT_EXIST_ID))

    const result = await SupplyService.updateUnitList(body.splSeq, body.unit, body.unitCnt)
    if (result == null) {
        res.status(HttpStatusCodes.BAD_REQUEST).send(ResponseError.getBadBody(['splSeq']))
        return
    }
    // validation end

    const uProduct = await Product.findOne({ where: { seq } })
    res.status(HttpStatusCodes.OK).send({ supply: result.supply.toJSON(), product: uProduct!.toJSON() })
})

router.delete('/:seq', async (req, res) => {
    const seq = +req.params.seq
    // validation
    if (isNaN(seq)) res.status(HttpStatusCodes.BAD_REQUEST).send(ResponseError.get(Codes.BAD_ROUTE_PARAM))

    const delCnt = await Product.destroy({ where: { seq } })
    if (delCnt == 0) res.status(HttpStatusCodes.BAD_REQUEST).send(ResponseError.get(Codes.NOT_EXIST_ID))
    // validation end
    res.sendStatus(HttpStatusCodes.NO_CONTENT)
})

export default router
