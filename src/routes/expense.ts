import { Router } from 'express'
import DB from '../models'
import HttpStatusCodes from '@src/common/HttpStatusCodes'
import { Codes, converNumRes, ResponseError } from '@src/common/ResponseError'

const router = Router()
const { Expense, ExpenseCategory, ExpenseProduct, Store, Product, ProductInfo, Unit } = DB.Models

router.get('/', async (req, res) => {
    const list = await Expense.findAll({
        include: [
            {
                model: ExpenseCategory,
                as: 'category',
            },
            {
                model: Store,
                as: 'store',
            },
            {
                model: ExpenseProduct,
                as: 'expsPrds',
                include: [
                    {
                        model: Product,
                        as: 'product',
                        include: [
                            {
                                model: ProductInfo,
                                as: 'prdInfo',
                            },
                            {
                                model: Unit,
                                as: 'unit',
                            },
                        ],
                    },
                ],
            },
        ],
    })

    return res.status(HttpStatusCodes.OK).send(list)
})

router.get('/:seq', async (req, res) => {
    const seq = converNumRes(req.params.seq, res)
    const exps = await Expense.findOne({
        where: { seq },
        raw: true,
    })

    return res.status(HttpStatusCodes.OK).send(exps)
})

// router.post('/', async (req, res) => {
//     const productInfo = req.body as ProductInfoCreationAttributes
//     const nProduct = await Expense.create(productInfo)

//     return res.status(HttpStatusCodes.CREATED).send(nProduct)
// })

// router.patch('/:seq', async (req, res) => {
//     const productInfo = req.body as ProductInfoAttributes
//     const seq = +req.params.seq

//     /** validate */
//     if (isNaN(seq)) {
//         res.status(HttpStatusCodes.BAD_REQUEST).send(ResponseError.get(Codes.BAD_ROUTE_PARAM))
//         return
//     }
//     const originProduct = await Expense.findOne({ where: { seq: productInfo.seq } })
//     if (originProduct == null) {
//         res.status(HttpStatusCodes.BAD_REQUEST).send(ResponseError.get(Codes.BAD_ROUTE_PARAM))
//         return
//     }
//     /** validate */

//     await Expense.update(productInfo, { where: { seq } })
//     const uProduct = await Expense.findOne({
//         where: { seq },
//     })

//     if (uProduct == null) {
//         res.status(HttpStatusCodes.BAD_REQUEST).send(ResponseError.get(Codes.NOT_EXIST_ID))
//         return
//     }

//     res.status(HttpStatusCodes.OK).send(uProduct.toJSON())
// })

// router.delete('/:seq', async (req, res) => {
//     const seq = +req.params.seq
//     if (isNaN(seq)) res.status(HttpStatusCodes.BAD_REQUEST).send(ResponseError.get(Codes.BAD_ROUTE_PARAM))

//     const delCnt = await Expense.destroy({ where: { seq } })
//     if (delCnt == 0) {
//         res.status(HttpStatusCodes.BAD_REQUEST).send(Codes.NOT_EXIST_ID)
//         return
//     }
//     await ExpenseProduct.destroy({ where: { prdInfoSeq: seq } })

//     res.sendStatus(HttpStatusCodes.NO_CONTENT)
// })

export default router
