import express from 'express'
import DB from '../models'
import { MenuCategoryAttributes, MenuCategoryCreationAttributes } from '@src/models/MenuCategory'
import HttpStatusCodes from '@src/common/HttpStatusCodes'

const router = express.Router()
const { MenuCategory } = DB.models

router.get('/', async (req, res) => {
    const menueCtgs = await MenuCategory.findAll()
    res.status(HttpStatusCodes.OK).send(menueCtgs.map((mc) => mc.toJSON()))
})

router.post('/', async (req, res) => {
    const body = req.body as MenuCategoryCreationAttributes
    const nMenuCtg = await MenuCategory.create(body)

    res.status(HttpStatusCodes.OK).send(nMenuCtg.get({ plain: true }))
})

router.put('/:name', async (req, res) => {
    const name = req.params.name
    const body = req.body as MenuCategoryAttributes

    const [_, uMenuCtgs] = await MenuCategory.update(body, { where: { name }, returning: true })
    if (uMenuCtgs.length == 0) {
        res.sendStatus(HttpStatusCodes.BAD_REQUEST)
        return
    } else if (uMenuCtgs.length > 1) {
        res.sendStatus(HttpStatusCodes.NOT_IMPLEMENTED)
        return
    }

    res.status(HttpStatusCodes.OK).send(uMenuCtgs[0].toJSON())
})

router.delete('/:name', async (req, res) => {
    const name = req.params.name
    const delCnt = await MenuCategory.destroy({ where: { name } })
    if (delCnt == 0) {
        res.sendStatus(HttpStatusCodes.BAD_REQUEST)
        return
    }

    res.sendStatus(HttpStatusCodes.NO_CONTENT)
})

export default router
