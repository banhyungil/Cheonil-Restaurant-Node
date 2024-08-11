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

router.patch('/:seq', async (req, res) => {
    const { seq } = req.params
    const body = req.body as MenuAttributes
    const [uCnt] = await Menu.update(body, { where: { seq } })
    if (uCnt == 0) {
        res.sendStatus(HttpStatusCodes.BAD_REQUEST)
        return
    }

    const uMenue = await Menu.findOne({ where: { seq } })

    res.status(HttpStatusCodes.OK).send(uMenue?.toJSON())
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
