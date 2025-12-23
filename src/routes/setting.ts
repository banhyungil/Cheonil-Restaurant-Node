import HttpStatusCodes from '@src/common/HttpStatusCodes'
import { Codes, ResponseError } from '@src/common/ResponseError'
import { Models } from '@src/models'
import { SettingAttributes, SettingCreationAttributes } from '@src/models/Setting'
import { Router } from 'express'

const router = Router()
const { Setting } = Models

router.get('/', async (_, res) => {
    const settings = await Setting.findAll()
    res.status(HttpStatusCodes.OK).send(settings[0].get({ plain: true }))
})

router.post('/', async (req, res) => {
    const body = req.body as SettingCreationAttributes

    const nSetting = await Setting.create(body)
    res.status(HttpStatusCodes.CREATED).send(nSetting.get({ plain: true }))
})

router.put('/:seq', async (req, res) => {
    const seq = +req.params.seq
    const body = req.body as SettingAttributes

    await Setting.update(body, { where: { seq } })
    const uSetting = await Setting.findOne({ where: { seq } })
    res.status(HttpStatusCodes.OK).send(uSetting!.get({ plain: true }))
})

export default router
