import express from 'express'
import { StoreAttributes, StoreCreationAttributes } from '../models/Store'
import DB from '@src/models'
import HttpStatusCodes from '@src/common/HttpStatusCodes'
// import { fileURLToPath } from 'url'
const router = express.Router()

const { Store } = DB.models
router.get('/', async (req, res) => {
    const stores = await Store.findAll({ raw: true })

    res.status(HttpStatusCodes.OK).send(stores)
})

router.post('/', async (req, res) => {
    const body = req.body as StoreCreationAttributes
    const nStore = await Store.create(body)

    res.status(HttpStatusCodes.CREATED).send(nStore.toJSON())
})

router.put('/:seq', async (req, res) => {
    const { seq } = req.params
    const body = req.body as StoreAttributes

    const [_, uStores] = await Store.update(body, { where: { seq }, returning: true })
    if (uStores.length == 0) {
        res.sendStatus(HttpStatusCodes.BAD_REQUEST)
        return
    } else if (uStores.length > 1) {
        res.sendStatus(HttpStatusCodes.NOT_IMPLEMENTED)
        return
    }

    res.sendStatus(200)
})

router.delete('/:seq', async (req, res) => {
    const { seq } = req.params
    const delCnt = await Store.destroy({ where: { seq } })
    if (delCnt == 0) {
        res.sendStatus(HttpStatusCodes.BAD_REQUEST)
        return
    }

    res.sendStatus(HttpStatusCodes.NO_CONTENT)
})

export default router
