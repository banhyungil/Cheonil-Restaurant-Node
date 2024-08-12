import express from 'express'
import DB from '@src/models'
import { OrderMenuAttributes } from '../models/OrderMenu'
import { MyOrderAttributes } from '@src/models/MyOrder'
import { Op } from 'sequelize'
import qs from 'qs'
import HttpStatusCodes from '@src/common/HttpStatusCodes'
import OrderService from '@src/services/OrderService'
import { PaymentAttributes } from '@src/models/Payment'
// import { fileURLToPath } from 'url'
const router = express.Router()

const { MyOrder, OrderMenu, Payment, Menu, Store } = DB.models

router.get('/', async (req, res) => {
    const queryStr = req.url.slice(req.url.indexOf('?') + 1)

    const info = qs.parse(queryStr) ?? {}
    const { limit, offset, sortBy, payTypes } = info

    delete info.limit
    delete info.offset
    delete info.sortBy
    delete info.payTypes

    let paymentWhereInfo
    if (payTypes) {
        paymentWhereInfo = {
            payType: {
                [Op.in]: payTypes,
            },
        }
    }

    /* eslint-disable */
    const whereInfo = {} as Record<string, Object>
    Object.entries(info).forEach(([col, oi]) => {
        const opInfo = oi as Object


        // 조건 연산자
        Object.entries(opInfo).forEach(([opKey, val]) => {
            const type = opKey as keyof typeof Op

            whereInfo[col] = {
                [Op[type]]: val
            }
            
        })
    })
    /* eslint-enable */

    const orders = await MyOrder.findAll({
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
                where: paymentWhereInfo,
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
    const totalCnt = await MyOrder.count({ where: whereInfo })

    res.status(HttpStatusCodes.OK).send({ orders: orders.map((order) => order.toJSON()), totalCnt })
})

router.get('/:seq', async (req, res) => {
    const { seq } = req.params
    const order = await MyOrder.findOne({
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
    if (order == null) {
        res.sendStatus(HttpStatusCodes.BAD_REQUEST)
        return
    }

    res.status(HttpStatusCodes.OK).send(order.toJSON())
})

// orderMenu 와 같이 생성
router.post('/', async (req, res) => {
    const { order, orderMenues } = req.body as {
        order: MyOrderAttributes
        orderMenues: OrderMenuAttributes[]
    }

    let nOrder = {} as InstanceType<typeof MyOrder>
    await DB.sequelize.transaction(async () => {
        nOrder = await MyOrder.create(order)
        orderMenues.forEach((om) => {
            om.orderSeq = nOrder.seq
        })

        await OrderMenu.bulkCreate(orderMenues)
    })

    const nMyOrder = await OrderService.getOrder(nOrder?.seq)

    if (nMyOrder == null) {
        res.sendStatus(HttpStatusCodes.BAD_REQUEST)
        return
    }

    res.status(HttpStatusCodes.CREATED).send(nMyOrder.toJSON())
})

// 주문 변경
router.patch('/:seq', async (req, res) => {
    const seq = +req.params.seq
    const { order, orderMenues = [] } = req.body as {
        order: MyOrderAttributes
        orderMenues: OrderMenuAttributes[]
    }

    await DB.sequelize.transaction(() => {
        const prms = [MyOrder.update(order, { where: { seq } }), ...orderMenues.map((om) => OrderMenu.upsert(om))]
        return Promise.all(prms)
    })

    const uOrder = await OrderService.getOrder(seq)

    res.status(HttpStatusCodes.OK).send(uOrder?.toJSON())
})

router.delete('/:seq', async (req, res) => {
    const seq = +req.params.seq

    await DB.sequelize.transaction(async () => {
        await OrderMenu.destroy({ where: { orderSeq: seq } })
        await Payment.destroy({ where: { orderSeq: seq } })
        const delCnt = await MyOrder.destroy({ where: { seq } })

        if (delCnt == 0) {
            res.sendStatus(HttpStatusCodes.BAD_REQUEST)
            return
        }
    })

    res.sendStatus(HttpStatusCodes.NO_CONTENT)
})

export default router
