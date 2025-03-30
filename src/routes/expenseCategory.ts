import { Router } from 'express'
import DB from '../models'
import { ExpenseCategoryAttributes, ExpenseCategoryCreationAttributes } from '@src/models/ExpenseCategory'
import { Codes, ResponseError } from '@src/common/ResponseError'
import HttpStatusCodes from '@src/common/HttpStatusCodes'

const router = Router()

const { ExpenseCategory } = DB.Models

router.get('/', async (req, res) => {
    const expsCtgs = await ExpenseCategory.findAll({ raw: true })

    return expsCtgs
})

router.post('/', async (req, res) => {
    const body = req.body as ExpenseCategoryCreationAttributes
    const nExpsCtg = await ExpenseCategory.create(body)

    return nExpsCtg
})

router.patch('/:seq', async (req, res) => {
    const seq = +req.params.seq
    const body = req.body as ExpenseCategoryAttributes

    await ExpenseCategory.update(body, { where: { seq } })
    const uExpsCtg = await ExpenseCategory.findOne({ where: { seq }, raw: true })
    if (uExpsCtg == null) {
        res.status(HttpStatusCodes.BAD_REQUEST).send(ResponseError.get(Codes.NOT_EXIST_ID))
        return
    }

    return uExpsCtg
})

router.delete('/:seq', async (req, res) => {
    const seq = +req.params.seq
    await ExpenseCategory.destroy({ where: { seq } })

    res.sendStatus(HttpStatusCodes.NO_CONTENT)
})
