import express from 'express'
import DB from '@src/models'
import { StoreCategoryAttributes, StoreCategoryCreationAttributes } from '../models/StoreCategory'
import HttpStatusCodes from '@src/common/HttpStatusCodes'
// import { fileURLToPath } from 'url'
const router = express.Router()

const { StoreCategory } = DB.models
router.get('/', async (req, res) => {
    const storeCtgs = await StoreCategory.findAll({ raw: true })

    res.status(HttpStatusCodes.OK).send(storeCtgs)
})

router.post('/', async (req, res) => {
    const body = req.body as StoreCategoryCreationAttributes
    const nStoreCtg = await StoreCategory.create(body)

    res.status(HttpStatusCodes.CREATED).send(nStoreCtg.toJSON())
})

router.patch('/:seq', async (req, res) => {
    const seq = +req.params.seq
    const storeCtg = req.body as StoreCategoryAttributes

    const [uCnt] = await StoreCategory.update(storeCtg, { where: { seq } })
    if (uCnt == 0) {
        res.sendStatus(HttpStatusCodes.BAD_REQUEST)
        return
    }
    const uStoreCtg = await StoreCategory.findOne({ where: { seq } })

    res.status(HttpStatusCodes.OK).send(uStoreCtg?.toJSON())
})

router.delete('/:seq', async (req, res) => {
    const { seq } = req.params
    const delCnt = await StoreCategory.destroy({ where: { seq } })
    if (delCnt == 0) {
        res.sendStatus(HttpStatusCodes.BAD_REQUEST)
        return
    }

    res.sendStatus(HttpStatusCodes.NO_CONTENT)
})

export default router
