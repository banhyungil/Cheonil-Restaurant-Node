import express from 'express'
import { Menu } from '../models/Menu'
// import { fileURLToPath } from 'url'
const router = express.Router()

router.get('/', async (req, res) => {
    const menues = await Menu.findAll()
    res.send({ list: menues })
})

router.post('/', async (req, res) => {
    const menu = req.body
    await Menu.create(menu)

    res.sendStatus(200)
})

router.put('/:name', async (req, res) => {
    const { name } = req.params
    const menu = req.body
    await Menu.update(menu, { where: { name } })

    res.sendStatus(200)
})

router.delete('/:name', async (req, res) => {
    const { name } = req.params
    await Menu.destroy({ where: { name } })

    res.sendStatus(200)
})

export default router
