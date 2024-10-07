import { Router } from 'express'
import DB from '../models'
import HttpStatusCodes from '@src/common/HttpStatusCodes'
import { ProductCreationAttributes } from '@src/models/Product'
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
    const { product, unitNm, unitCntList } = req.body as ReqBody
    const cnt = await MapProductUnit.count({ where: { unitNm } })
    if (cnt == 0) {
        res.status(HttpStatusCodes.BAD_REQUEST).send({ ...ResponseError.get(Codes.BAD_BODY), message: '식자재에 등록되지 않은 단위입니다.' })
        return
    }

    const nProduct = await Product.create(product)
    await MapProductUnit.create({ prdSeq: nProduct.seq, unitNm, unitCntList })

    const resProduct = await Product.findOne({
        include: {
            as: 'units',
            model: Unit,
        },
        where: { seq: nProduct.seq },
    })

    return res.status(HttpStatusCodes.CREATED).send(resProduct)
})

router.patch('/:seq', async (req, res) => {
    const { product, unitNm, unitCntList } = req.body as ReqBody
    const seq = +req.params.seq
    if (isNaN(seq)) res.status(HttpStatusCodes.BAD_REQUEST).send(ResponseError.get(Codes.BAD_ROUTE_PARAM))
    const cnt = await MapProductUnit.count({ where: { unitNm } })
    if (cnt == 0) {
        res.status(HttpStatusCodes.BAD_REQUEST).send({ ...ResponseError.get(Codes.BAD_BODY), message: '식자재에 등록되지 않은 단위입니다.' })
        return
    }

    await Product.update(product, { where: { seq } })
    await MapProductUnit.upsert({ prdSeq: seq, unitNm, unitCntList })

    const uProduct = await Product.findOne({
        include: {
            as: 'units',
            model: Unit,
        },
        where: { seq },
    })
    res.status(HttpStatusCodes.OK).send(uProduct!.toJSON())
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

interface ReqBody {
    product: ProductCreationAttributes
    unitNm: string
    unitCntList?: number[]
}
