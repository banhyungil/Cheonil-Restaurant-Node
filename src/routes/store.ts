import express from 'express'
import { Store } from '../models/Store'
// import { fileURLToPath } from 'url'
const router = express.Router()

/* GET home page. */
router.get('/', async (req, res) => {
    const stores = await Store.findAll()
    res.send({ list: stores })
})

router.post('/', async (req, res) => {
    const store = req.body
    await Store.create(store)
    res.sendStatus(200)
})

router.put('/:id', async (req, res) => {
    const { id } = req.params
    const store = req.body
    await Store.update(store, { where: { id } })
    res.sendStatus(200)
})

router.delete('/:id', async (req, res) => {
    const { id } = req.params
    await Store.destroy({ where: { id } })
    res.sendStatus(200)
})

export default router
