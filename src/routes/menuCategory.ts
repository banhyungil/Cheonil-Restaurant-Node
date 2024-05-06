import express from 'express'
import { MenuCategory } from '../models/MenuCategory'

const router = express.Router()

router.get('/', async (req, res) => {
    const menues = await MenuCategory.findAll()
    res.send({ list: menues })
})

router.post('/', async (req, res) => {
    const menuCtg = req.body
    await MenuCategory.create(menuCtg)
    res.sendStatus(200)
})

router.put('/:name', async (req, res) => {
    const name = req.params.name
    const menuCtg = req.body
    await MenuCategory.update(menuCtg, { where: { name } })
    res.sendStatus(200)
})

router.delete('/:name', async (req, res) => {
    const name = req.params.name
    await MenuCategory.destroy({ where: { name } })
    res.sendStatus(200)
})

export default router
