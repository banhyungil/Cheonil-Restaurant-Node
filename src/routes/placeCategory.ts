import express from 'express'
import { PlaceCategory } from '../models/PlaceCategory'
// import { fileURLToPath } from 'url'
const router = express.Router()

router.get('/', async (req, res) => {
    const placeCtgs = await PlaceCategory.findAll({ raw: true })
    res.send({ list: placeCtgs })
})

router.post('/', async (req, res) => {
    const placeCtg = req.body
    await PlaceCategory.create(placeCtg)
    res.sendStatus(200)
})

router.put('/:name', async (req, res) => {
    const name = req.params.name
    const placeCtg = req.body
    await PlaceCategory.update(placeCtg, { where: { name } })
    res.sendStatus(200)
})

router.delete('/:name', async (req, res) => {
    const name = req.params.name
    await PlaceCategory.destroy({ where: { name } })
    res.sendStatus(200)
})

export default router
