import express from 'express'
import { Models } from '../models'
import { MenuCategoryAttributes, MenuCategoryCreationAttributes } from '@src/models/MenuCategory'
import HttpStatusCodes from '@src/common/HttpStatusCodes'

const router = express.Router()
const { MenuCategory, Menu } = Models

router.get('/', async (req, res) => {
    const menueCtgs = await MenuCategory.findAll()
    res.status(HttpStatusCodes.OK).send(menueCtgs.map((mc) => mc.toJSON()))
})

router.post('/', async (req, res) => {
    const body = req.body as MenuCategoryCreationAttributes
    const nMenuCtg = await MenuCategory.create(body)

    res.status(HttpStatusCodes.OK).send(nMenuCtg.get({ plain: true }))
})

router.patch('/:seq', async (req, res) => {
    const { seq } = req.params
    const body = req.body as MenuCategoryAttributes

    const [uCnt] = await MenuCategory.update(body, { where: { seq } })
    if (uCnt == 0) {
        res.sendStatus(HttpStatusCodes.BAD_REQUEST)
        return
    }
    const uMenuCtg = await MenuCategory.findOne({ where: { seq } })

    res.status(HttpStatusCodes.OK).send(uMenuCtg?.toJSON())
})

router.delete('/:seq', async (req, res) => {
    const { seq } = req.params
    const delCnt = await MenuCategory.destroy({ where: { seq } })
    // 관련 메뉴도 모두 삭제
    await Menu.destroy({
        where: {
            ctgSeq: seq,
        },
    })

    if (delCnt == 0) {
        res.sendStatus(HttpStatusCodes.BAD_REQUEST)
        return
    }

    res.sendStatus(HttpStatusCodes.NO_CONTENT)
})

export default router
