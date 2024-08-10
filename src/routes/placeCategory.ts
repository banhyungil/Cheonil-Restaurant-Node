import express from 'express'
import DB from '@src/models'
import { PlaceCategoryAttributes, PlaceCategoryCreationAttributes } from '../models/PlaceCategory'
import HttpStatusCodes from '@src/common/HttpStatusCodes'
// import { fileURLToPath } from 'url'
const router = express.Router()

const { PlaceCategory } = DB.models
router.get('/', async (req, res) => {
    const placeCtgs = await PlaceCategory.findAll()

    res.send(placeCtgs.map((item) => item.toJSON()))
})

router.post('/', async (req, res) => {
    const body = req.body as PlaceCategoryCreationAttributes
    const nPlaceCtg = await PlaceCategory.create(body)

    res.status(HttpStatusCodes.CREATED).send(nPlaceCtg.toJSON())
})

router.put('/:name', async (req, res) => {
    const name = req.params.name
    const body = req.body as PlaceCategoryAttributes
    const [_, uPlaceCtgs] = await PlaceCategory.update(body, { where: { name }, returning: true })
    if (uPlaceCtgs.length == 0) {
        res.sendStatus(HttpStatusCodes.BAD_REQUEST)
        return
    } else if (uPlaceCtgs.length > 1) {
        res.sendStatus(HttpStatusCodes.NOT_IMPLEMENTED)
        return
    }

    res.status(200).send(uPlaceCtgs[0].toJSON())
})

router.delete('/:name', async (req, res) => {
    const name = req.params.name
    const delCnt = await PlaceCategory.destroy({ where: { name } })
    if (delCnt == 0) {
        res.sendStatus(HttpStatusCodes.BAD_REQUEST)
        return
    }

    res.sendStatus(HttpStatusCodes.NO_CONTENT)
})

export default router
