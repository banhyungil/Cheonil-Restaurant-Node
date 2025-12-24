import { Router } from 'express'
import { Models, sequelize } from '../models'
import HttpStatusCodes from '@src/common/HttpStatusCodes'
import { Codes, converNumRes, ResponseError } from '@src/common/ResponseError'
import { ExpenseAttributes, ExpenseCreationAttributes } from '@src/models/Expense'
import { ExpenseProductAttributes, ExpenseProductCreationAttributes } from '@src/models/ExpenseProduct'
import { Includeable, Op } from 'sequelize'

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

    const include = [] as Includeable[]
    if (query?.expand) {
        const fileds = query.expand.split(',')

        if (fileds.includes('category')) {
            include.push({
                as: 'category',
                model: ExpenseCategory,
            })
        } else if (fileds.includes('store')) {
            include.push({
                as: 'store',
                model: Store,
            })
        } else if (fileds.includes('expsPrds')) {
            include.push({
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
        include: include,
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

router.patch('/:seq', async (req, res) => {
    const { expense, expenseProducts } = req.body as { expense: ExpenseAttributes; expenseProducts: ExpenseProductAttributes[] }
    const seq = +req.params.seq

    /** validate */
    if (isNaN(seq)) {
        res.status(HttpStatusCodes.BAD_REQUEST).send(ResponseError.get(Codes.BAD_ROUTE_PARAM))
        return
    } else if (expenseProducts == null || expenseProducts.length == 0) {
        res.status(HttpStatusCodes.BAD_REQUEST).send(ResponseError.get(Codes.BAD_ROUTE_PARAM))
        return
    }
    /** validate */

    await Expense.update(expense, { where: { seq } })
    const uProduct = await Expense.findOne({
        where: { seq },
    })
    await sequelize.transaction(async (t) => {
        await Promise.all(
            expenseProducts.map((expsPrd) => ExpenseProduct.update(expsPrd, { where: { expsSeq: expsPrd.expsSeq, prdSeq: expsPrd.prdSeq } })),
        )
    })
    const prdSeqs = expenseProducts.map((expsPrd) => expsPrd.prdSeq)
    const uExpsPrds = ExpenseProduct.findAll({ where: { expsSeq: seq, prdSeq: { [Op.in]: prdSeqs } } })

    res.status(HttpStatusCodes.OK).send({ expense: uProduct, expenseProducts: uExpsPrds })
})

router.delete('/:seq', async (req, res) => {
    const seq = +req.params.seq
    if (isNaN(seq)) res.status(HttpStatusCodes.BAD_REQUEST).send(ResponseError.get(Codes.BAD_ROUTE_PARAM))

    const delCnt = await Expense.destroy({ where: { seq } })
    if (delCnt == 0) {
        res.status(HttpStatusCodes.BAD_REQUEST).send(Codes.NOT_EXIST_ID)
        return
    }
    await ExpenseProduct.destroy({ where: { expsSeq: seq } })

    res.send(HttpStatusCodes.NO_CONTENT)
})

export default router
