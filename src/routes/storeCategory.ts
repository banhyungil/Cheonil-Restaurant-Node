import express from 'express'
import { StoreCategory } from '../models/StoreCategory'
// import { fileURLToPath } from 'url'
const router = express.Router()

router.get('/', async (req, res) => {
    const storeCtgs = await StoreCategory.findAll({ raw: true })
    res.send({ list: storeCtgs })
})

router.post('/', async (req, res) => {
    const storeCtg = req.body
    await StoreCategory.create(storeCtg)
    res.sendStatus(200)
})

router.put('/:name', async (req, res) => {
    const name = req.params.name
    const storeCtg = req.body
    await StoreCategory.update(storeCtg, { where: { name } })
    res.sendStatus(200)
})

router.delete('/:name', async (req, res) => {
    const name = req.params.name
    await StoreCategory.destroy({ where: { name } })
    res.sendStatus(200)
})

export default router
