import express from 'express'
import DB from '@src/models'
import { PlaceCategoryAttributes, PlaceCategoryCreationAttributes } from '../models/PlaceCategory'
import HttpStatusCodes from '@src/common/HttpStatusCodes'
// import { fileURLToPath } from 'url'
const router = express.Router()

const { PlaceCategory, StoreCategory, Store } = DB.Models
router.get('/', async (req, res) => {
    const placeCtgs = await PlaceCategory.findAll()

    res.send(placeCtgs.map((item) => item.toJSON()))
})

router.post('/', async (req, res) => {
    const body = req.body as PlaceCategoryCreationAttributes
    const nPlaceCtg = await PlaceCategory.create(body)

    res.status(HttpStatusCodes.CREATED).send(nPlaceCtg.toJSON())
})

router.patch('/:seq', async (req, res) => {
    const seq = +req.params.seq
    const body = req.body as PlaceCategoryAttributes
    const [uCnt] = await PlaceCategory.update(body, { where: { seq } })
    if (uCnt == 0) {
        res.sendStatus(HttpStatusCodes.BAD_REQUEST)
        return
    }

    const uPlaceCtg = await PlaceCategory.findOne({ where: { seq } })

    res.status(HttpStatusCodes.OK).send(uPlaceCtg?.toJSON())
})

router.delete('/:seq', async (req, res) => {
    const seq = +req.params.seq
    const delCnt = await PlaceCategory.destroy({ where: { seq } })
    if (delCnt == 0) {
        res.sendStatus(HttpStatusCodes.BAD_REQUEST)
        return
    }
    await StoreCategory.update({ placeCtgseq: seq }, { where: { placeCtgseq: seq } })
    await Store.update({ placeCtgseq: seq }, { where: { placeCtgseq: seq } })

    res.sendStatus(HttpStatusCodes.NO_CONTENT)
})

export default router
