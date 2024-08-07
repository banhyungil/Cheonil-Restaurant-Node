import express from 'express'
import { MenuCreationAttributes } from '../models/Menu'
import DB from '../models'
import HttpStatusCodes from '@src/common/HttpStatusCodes'
// import { fileURLToPath } from 'url'
const router = express.Router()
const { Menu } = DB.models

router.get('/', async (req, res) => {
    const menues = await Menu.findAll()
    res.status(200).send(menues.map((menu) => menu.get({ plain: true })))
})

router.post('/', async (req, res) => {
    const menu = req.body as MenuCreationAttributes
    const nMenu = await Menu.create(menu)

    res.status(HttpStatusCodes.OK).send(nMenu.get({ plain: true }))
})

router.put('/:seq', async (req, res) => {
    const { seq } = req.params
    const menu = req.body
    await Menu.update(menu, { where: { seq } })

    res.status(HttpStatusCodes.CREATED).sendStatus(200)
})

router.delete('/:seq', async (req, res) => {
    const { seq } = req.params
    await Menu.destroy({ where: { seq } })

    res.status(HttpStatusCodes.NO_CONTENT).sendStatus(200)
})

export default router
