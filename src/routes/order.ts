import express from 'express'
import { Order, OrderAttributes } from '../models/Order'
import { OrderMenu, OrderMenuAttributes } from '../models/OrderMenu'
import { Model, Op } from 'sequelize'
import { Menu } from '../models/Menu'
import { Store } from '../models/Store'
import DB from '../models/index.ts'
import qs from 'qs'
import { Payment } from '../models/Payment.ts'
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

    const result = await Order.findAll({
        include: [
            {
                model: OrderMenu,
                as: 'orderMenues',
                include: [
                    {
                        model: Menu,
                        as: 'menu',
                    },
                ],
            },
            {
                model: Payment,
                as: 'payments',
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
    const orders = getPlain(result) as OrderAttributes[]

    res.send({ list: orders })
})

router.get('/:seq', async (req, res) => {
    const { seq } = req.params
    const result = await Order.findOne({
        include: [
            {
                model: OrderMenu,
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
        where: { seq: seq },
    })
    if (result) {
        const orderResult = getPlain(result) as OrderAttributes[]
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
        order: OrderAttributes
        orderMenues: OrderMenuAttributes[]
    }

    await Order.create(order).then(async (nOrder) => {
        orderMenues.forEach((om) => {
            om.orderSeq = nOrder.seq
        })

        await OrderMenu.bulkCreate(orderMenues)
    })

    res.sendStatus(200)
})

// 주문 변경
router.patch('/:seq', async (req, res) => {
    const seq = req.params.seq
    const { order, orderMenues = [] } = req.body as {
        order: OrderAttributes
        orderMenues: OrderMenuAttributes[]
    }

    await DB.sequelize.transaction((t) => {
        const prms = [
            Order.update(order, { where: { seq } }),
            ...orderMenues.map((om) => OrderMenu.upsert(om)),
        ]
        return Promise.all(prms)
    })

    res.sendStatus(200)
})

router.delete('/:seq', async (req, res) => {
    const seq = req.params.seq

    OrderMenu.destroy({ where: { orderSeq: seq } })
    Order.destroy({ where: { seq } })

    res.sendStatus(200)
})

export default router
