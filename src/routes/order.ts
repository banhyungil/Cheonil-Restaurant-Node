import express from 'express'
import { TOrder } from '../models/TOrder'
// import { fileURLToPath } from 'url'
const router = express.Router()

router.get('/', async (req, res) => {
    const orders = await TOrder.findAll()

    res.send({ list: orders })
})

router.post('/', async (req, res) => {
    const order = req.body
    TOrder.create(order)
})

router.put('/:id', async (req, res) => {
    const id = req.params.id
    const order = req.body
    TOrder.update(order, { where: { id } })
})

router.delete('/:id', async (req, res) => {
    const id = req.params.id
    TOrder.destroy({ where: { id } })
})

export default router
