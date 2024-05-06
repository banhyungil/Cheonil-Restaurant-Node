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

router.put('/:id', async (req, res) => {
    const id = req.params.id
    const menu = req.body
    await Menu.update(menu, { where: { id } })

    res.sendStatus(200)
})

router.delete('/:id', async (req, res) => {
    const id = req.params.id
    await Menu.destroy({ where: { id } })

    res.sendStatus(200)
})

export default router
