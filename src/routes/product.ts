import Paths from '@src/common/Paths'
import { Router } from 'express'
import DB from '../models'
import HttpStatusCodes from '@src/common/HttpStatusCodes'
import { ProductAttributes, ProductCreationAttributes } from '@src/models/Product'
import { SupplyAttributes, SupplyCreationAttributes } from '@src/models/Supply'

const router = Router()
const { Product, Supply } = DB.Models

router.get(Paths.Product, async (req, res) => {
    const products = await Product.findAll({ include: 'supply' })

    return res.status(HttpStatusCodes.OK).send(products.map((item) => item.toJSON()))
})

router.post(Paths.Product, async (req, res) => {
    const body = req.body as ProductCreationAttributes
    const supply = await Supply.findOne({ where: { seq: body.splSeq } })
    if (supply == null) throw new Error('not possible')

    const { unit, unitCnt } = body
    if (supply.unitList.includes(unit) == false) {
        supply.unitList.push(unit)
    }
    if (unitCnt) {
        if (supply.unitCntList == null) supply.unitCntList = []
        if (supply.unitCntList.includes(unitCnt) == false) {
            supply.unitCntList.push(unitCnt)
        }
    }
    await supply.save()
    const nProduct = await Product.create(body)

    return res.status(HttpStatusCodes.CREATED).send({ supply: supply.toJSON(), product: nProduct.toJSON() })
})

router.patch(`${Paths.Product}/:seq`, async (req, res) => {
    const body = req.body as ProductAttributes
    const seq = req.params.seq
})
