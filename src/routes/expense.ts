import { Router } from 'express'
import DB from '../models'
import HttpStatusCodes from '@src/common/HttpStatusCodes'
import { Codes, converNumRes, ResponseError } from '@src/common/ResponseError'
import ProductService from '@src/services/ProductService'
import { Expense as ExpenseType } from '@src/models/Expense'

const router = Router()
const { Expense, ExpenseProduct } = DB.Models

async function getExpense(exps: ExpenseType) {
    const prdSeqs = exps.expsPrds!.map((eprd) => eprd.prdSeq)
    // products 추가
    const products = (await ProductService.selectProducts(prdSeqs)).map((prd) => prd.toJSON())
    const raw = exps.toJSON()
    raw.expsPrds!.forEach((expsPrd) => Object.assign(expsPrd, products))

    return raw
}

router.get('/', async (req, res) => {
    const list = await Expense.findAll({
        include: [
            {
                model: ExpenseProduct,
                as: 'expsPrds',
            },
        ],
    })

    const resBody = await Promise.all(list.map(async (exps) => getExpense(exps)))

    return res.status(HttpStatusCodes.OK).send(resBody)
})

router.get('/:seq', async (req, res) => {
    const seq = converNumRes(req.params.seq, res)
    const exps = await Expense.findOne({
        include: [
            {
                model: ExpenseProduct,
                as: 'expsPrds',
            },
        ],
        where: { seq },
    })

    if (exps == null) {
        res.status(HttpStatusCodes.BAD_REQUEST).send(ResponseError.get(Codes.NOT_EXIST_ID))
        return
    }
    const resBody = await getExpense(exps)
    return res.status(HttpStatusCodes.OK).send(resBody)
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
