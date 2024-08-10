import express from 'express'
import { MenuAttributes, MenuCreationAttributes } from '../models/Menu'
import DB from '../models'
import HttpStatusCodes from '@src/common/HttpStatusCodes'

const router = express.Router()
const { Menu } = DB.models

router.get('/', async (req, res) => {
    const menues = await Menu.findAll()

    res.status(200).send(menues.map((menu) => menu.toJSON()))
})

router.post('/', async (req, res) => {
    const body = req.body as MenuCreationAttributes
    const nMenu = await Menu.create(body)

    res.status(HttpStatusCodes.OK).send(nMenu.toJSON())
})

router.put('/:seq', async (req, res) => {
    const { seq } = req.params
    const body = req.body as MenuAttributes
    const [_, uMenues] = await Menu.update(body, { where: { seq }, returning: true })
    if (uMenues.length == 0) {
        res.sendStatus(HttpStatusCodes.BAD_REQUEST)
        return
    } else if (uMenues.length > 1) {
        res.sendStatus(HttpStatusCodes.NOT_IMPLEMENTED)
        return
    }

    res.status(HttpStatusCodes.OK).send(uMenues[0].toJSON())
})

router.delete('/:seq', async (req, res) => {
    const { seq } = req.params
    const delCnt = await Menu.destroy({ where: { seq } })
    if (delCnt == 0) {
        res.sendStatus(HttpStatusCodes.BAD_REQUEST)
        return
    }

    res.sendStatus(HttpStatusCodes.NO_CONTENT)
})

export default router
