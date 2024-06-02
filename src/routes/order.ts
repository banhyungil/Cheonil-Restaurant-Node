import { TestId } from './../models/Test'
import express from 'express'
import { TOrder, TOrderAttributes } from '../models/TOrder'
import { TOrderMenu, TOrderMenuAttributes } from '../models/TOrderMenu'
import { Model, Op } from 'sequelize'
import { Menu } from '../models/Menu'
import { Store } from '../models/Store'
import DB from '../models/index.ts'
import qs from 'qs'
import url from 'url'

// import { fileURLToPath } from 'url'
const router = express.Router()

// router.use((req, res, next) => {
//     const timeCols = ['completeTime']
//     const order = req.body.order
//     timeCols.forEach((col) => {
//         if (order && col in order && order[col] instanceof Date == false) {
//             req.body[col] = new Date(req.body[col])
//             console.log('req.body[col]', req.body[col])
//         }
//     })
//     next()
// })
router.get('/', async (req, res) => {
    const queryStr = req.url.slice(req.url.indexOf('?') + 1)

    const info = qs.parse(queryStr) ?? {}
    const { limit, offset, sortBy } = info
    delete info.limit
    delete info.offset
    delete info.sortBy

    /* eslint-disable */
    const whereInfo = {} as Record<string, Object>
    Object.entries(info).forEach(([col, oi]) => {
        const opInfo = oi as Object
        Object.entries(opInfo).forEach(([opKey, val]) => {
            const type = opKey as keyof typeof Op

            whereInfo[col] = {
                [Op[type]]: val
            }
        })
    })
    /* eslint-enable */

    const result = await TOrder.findAll({
        include: [
            {
                model: TOrderMenu,
                as: 'orderMenues',
                include: [
                    {
                        model: Menu,
                        as: 'menu',
                    },
                ],
            },
            {
                model: Store,
                as: 'store',
            },
        ],
        where: whereInfo,
        limit: limit ? Number(limit) : undefined,
        offset: offset ? Number(offset) : undefined,
    })
    const orders = getPlain(result) as TOrderAttributes[]

    res.send({ list: orders })
})

router.get('/:id', async (req, res) => {
    const { id } = req.params
    const result = await TOrder.findOne({
        include: [
            {
                model: TOrderMenu,
                as: 'orderMenues',
                include: [
                    {
                        model: Menu,
                        as: 'menu',
                    },
                ],
            },
            {
                model: Store,
                as: 'store',
            },
        ],
        where: { id: id },
    })
    if (result) {
        const orderResult = getPlain(result) as TOrderAttributes[]
        res.send(orderResult[0])
    } else {
        res.send(null)
    }
})

function getPlain(model: Model | Model[]) {
    const models = Array.isArray(model) ? model : [model]
    return models.map((model) => {
        const result = model.dataValues
        Object.entries(result).forEach(([k, v]) => {
            if (Array.isArray(v)) {
                result[k] = v.map((subModel) => subModel.dataValues)
            } else if (typeof v == 'object' && v != null && 'dataValues' in v) {
                result[k] = v.dataValues
            }
        })

        return result
    })
}

// orderMenu 와 같이 생성
router.post('/', async (req, res) => {
    const { order, orderMenues } = req.body as {
        order: TOrderAttributes
        orderMenues: TOrderMenuAttributes[]
    }

    await TOrder.create(order).then(async (nOrder) => {
        orderMenues.forEach((om) => {
            om.orderId = nOrder.id
        })

        await TOrderMenu.bulkCreate(orderMenues)
    })

    res.sendStatus(200)
})

// 주문 변경
router.patch('/:id', async (req, res) => {
    const id = req.params.id
    const { order, orderMenues = [] } = req.body as {
        order: TOrderAttributes
        orderMenues: TOrderMenuAttributes[]
    }

    await DB.sequelize.transaction((t) => {
        const prms = [
            TOrder.update(order, { where: { id } }),
            ...orderMenues.map((om) => TOrderMenu.upsert(om)),
        ]
        return Promise.all(prms)
    })

    res.sendStatus(200)
})

router.delete('/:id', async (req, res) => {
    const id = req.params.id

    TOrderMenu.destroy({ where: { orderId: id } })
    TOrder.destroy({ where: { id } })

    res.sendStatus(200)
})

export default router
