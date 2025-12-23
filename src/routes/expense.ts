import { Router } from 'express'
import { Models } from '../models'
import HttpStatusCodes from '@src/common/HttpStatusCodes'
import { converNumRes } from '@src/common/ResponseError'
import { ExpenseCreationAttributes } from '@src/models/Expense'
import { ExpenseProductCreationAttributes } from '@src/models/ExpenseProduct'
import { Includeable } from 'sequelize'

const router = Router()
const { Expense, ExpenseCategory, ExpenseProduct, Store, Product, ProductInfo, Unit } = Models

router.get('/', async (req, res) => {
    const query = req.query as { expand?: string }

    const includes = [] as Includeable[]
    if (query?.expand) {
        const fileds = query.expand.split(',')

        if (fileds.includes('category')) {
            includes.push({
                as: 'category',
                model: ExpenseCategory,
            })
        } else if (fileds.includes('store')) {
            includes.push({
                as: 'store',
                model: Store,
            })
        } else if (fileds.includes('expsPrds')) {
            includes.push({
                as: 'expsPrds',
                model: ExpenseProduct,
                include: [
                    {
                        as: 'product',
                        model: Product,
                        include: [
                            { model: ProductInfo, as: 'prdInfo' },
                            { model: Unit, as: 'unit' },
                        ],
                    },
                ],
            })
        }
    }

    const list = await Expense.findAll({
        include: includes,
    })

    return res.status(HttpStatusCodes.OK).send(list)
})

router.get('/:seq', async (req, res) => {
    const seq = converNumRes(req.params.seq, res)

    const query = req.query as { expand?: string }

    const includes = [] as Includeable[]
    if (query?.expand) {
        const fileds = query.expand.split(',')

        if (fileds.includes('category')) {
            includes.push({
                as: 'category',
                model: ExpenseCategory,
            })
        } else if (fileds.includes('store')) {
            includes.push({
                as: 'store',
                model: Store,
            })
        } else if (fileds.includes('expsPrds')) {
            includes.push({
                as: 'expsPrds',
                model: ExpenseProduct,
                include: [
                    {
                        as: 'product',
                        model: Product,
                        include: [
                            { model: ProductInfo, as: 'prdInfo' },
                            { model: Unit, as: 'unit' },
                        ],
                    },
                ],
            })
        }
    }
    const exps = await Expense.findOne({
        where: { seq },
        raw: true,
    })

    return res.status(HttpStatusCodes.OK).send(exps)
})

router.post('/', async (req, res) => {
    const { expense, expenseProducts } = req.body as { expense: ExpenseCreationAttributes; expenseProducts: ExpenseProductCreationAttributes[] }

    const nExpense = await Expense.create(expense)
    expenseProducts.forEach((expsPrd) => (expsPrd.expsSeq = nExpense.seq))
    const nProducts = await ExpenseProduct.bulkCreate(expenseProducts)

    return res.status(HttpStatusCodes.CREATED).send({ expense: nExpense, expenseProducts: nProducts })
})

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
