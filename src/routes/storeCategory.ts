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

router.put('/:name', async (req, res) => {
    const name = req.params.name
    const storeCtg = req.body as StoreCategoryAttributes

    const [_, uStoreCtgs] = await StoreCategory.update(storeCtg, { where: { name }, returning: true })
    if (uStoreCtgs.length == 0) {
        res.sendStatus(HttpStatusCodes.BAD_REQUEST)
        return
    } else if (uStoreCtgs.length > 1) {
        res.sendStatus(HttpStatusCodes.NOT_IMPLEMENTED)
        return
    }

    res.status(HttpStatusCodes.OK).send(uStoreCtgs[0].toJSON())
})

router.delete('/:name', async (req, res) => {
    const name = req.params.name
    const delCnt = await StoreCategory.destroy({ where: { name } })
    if (delCnt == 0) {
        res.sendStatus(HttpStatusCodes.BAD_REQUEST)
        return
    }

    res.sendStatus(HttpStatusCodes.NO_CONTENT)
})

export default router
