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

router.patch('/:seq', async (req, res) => {
    const { seq } = req.params
    const body = req.body as StoreAttributes

    const [uCnt] = await Store.update(body, { where: { seq } })
    if (uCnt == 0) {
        res.sendStatus(HttpStatusCodes.BAD_REQUEST)
        return
    }

    const uStore = await Store.findOne({ where: { seq } })

    res.status(200).send(uStore?.toJSON())
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
