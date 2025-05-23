import express from 'express'
import DB from '@src/models'
import { OrderMenuAttributes } from '../models/OrderMenu'
import { MyOrderAttributes } from '@src/models/MyOrder'
import { Op, QueryTypes, WhereOptions } from 'sequelize'
import qs from 'qs'
import HttpStatusCodes from '@src/common/HttpStatusCodes'
import OrderService from '@src/services/OrderService'
import { PaymentAttributes, PaymentCreationAttributes } from '@src/models/Payment'
import _ from 'lodash'
import { Codes, converNumRes, ResponseError } from '@src/common/ResponseError'

const router = express.Router()

const { MyOrder, OrderMenu, Payment, Menu, Store } = DB.Models

interface QueryParams {
    whereOptions?: WhereOptions<Pick<MyOrderAttributes, 'status' | 'orderAt'> | Pick<PaymentAttributes, 'payAt' | 'payType'> | { storeName: string }>
    limit?: number
    offset?: number
    order?: MySequelizeOrder
}

function validateQueryParamInfo(queryParams: any): queryParams is QueryParams {
    const { whereOptions, limit, offset, order } = queryParams

    if (limit && (isNaN(Number(limit)) || Number(limit) < 0)) return false
    if (offset && (isNaN(Number(offset)) || Number(offset) < 0)) return false
    // TODO 정확한 Validation 필요
    if (order && !Array.isArray(order)) return false
    // TODO 정확한 Validation 필요
    if (whereOptions && typeof whereOptions != 'object') return false

    return true
}
router.get('/', async (req, res) => {
    const queryParams = req.url.slice(req.url.indexOf('?') + 1)
    const oQueryParams = qs.parse(queryParams) ?? {}

    if (validateQueryParamInfo(oQueryParams) == false) {
        res.sendStatus(HttpStatusCodes.BAD_REQUEST)
        return
    }

    const { whereOptions = {}, limit, offset, order } = oQueryParams as QueryParams

    const { orderWhereOption, payWhereOption, storeWhereOption } = (() => {
        const _orderWhereOption = {} as Record<string, object>
        const _payWhereOption = {} as Record<string, object>
        const _storeWhereOption = {} as Record<string, object>

        const orderCols = ['status', 'orderAt']
        const payCols = ['payAt', 'payType']
        const storeCols = ['storeName']
        // TODO 타입 오류 정정 필요
        Object.entries(whereOptions as any).forEach(([col, oi]) => {
            const opInfo = oi as object

            // 조건 연산자
            Object.entries(opInfo).forEach(([opKey, val]) => {
                const type = opKey as keyof typeof Op

                if (orderCols.includes(col))
                    _orderWhereOption[col] = {
                        [Op[type]]: val,
                    }
                else if (payCols.includes(col))
                    _payWhereOption[col] = {
                        [Op[type]]: val,
                    }
                else if (storeCols.includes(col)) {
                    const convert = col == 'storeName' ? 'name' : col
                    _storeWhereOption[convert] = {
                        [Op[type]]: val,
                    }
                }
            })
        })

        return {
            orderWhereOption: _.isEmpty(_orderWhereOption) ? undefined : _orderWhereOption,
            payWhereOption: _.isEmpty(_payWhereOption) ? undefined : _payWhereOption,
            storeWhereOption: _.isEmpty(_storeWhereOption) ? undefined : _storeWhereOption,
        }
    })()
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
                where: payWhereOption,
            },
            {
                model: Store,
                as: 'store',
                where: storeWhereOption,
            },
        ],
        where: orderWhereOption,
        limit: limit ? +limit : undefined,
        offset: offset ? +offset : undefined,
        order: order ?? [['orderAt', 'ASC']],
    })

    // paging 생략한 전체 개수
    const totalCnt = await MyOrder.count({
        include: [
            {
                model: Payment,
                as: 'payments',
                where: payWhereOption,
            },
            {
                model: Store,
                as: 'store',
                where: storeWhereOption,
                required: storeWhereOption ? true : false,
            },
        ],
        where: orderWhereOption,
    })

    res.status(HttpStatusCodes.OK).send({ orders: orders.map((order) => order.toJSON()), totalCnt })
})

// NOTE: 올바른 처리를 위해 동적 라우팅(/:seq) 보다 우선 정의 되어야 함
router.post('/account', async (req, res) => {
    const { dateRange } = req.body as { dateRange: [string, string] }

    // query
    const unionSql = `SELECT m.seq
                      FROM cheonil.MyOrder m, Payment p 
                      WHERE m.seq = p.orderSeq 
                      AND status in ('COOKED', 'PAID')
                      AND p.payAt BETWEEN "${dateRange[0]}" AND "${dateRange[1]}"
                      UNION
                      SELECT m.seq 
                      FROM MyOrder m
                      WHERE status in ('COOKED')
                      AND m.orderAt BETWEEN "${dateRange[0]}" AND "${dateRange[1]}"`
    const results: { seq: number }[] = await DB.sequelize.query(unionSql, {
        type: QueryTypes.SELECT,
        raw: true,
    })

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
            },
            {
                model: Store,
                as: 'store',
            },
        ],
        where: {
            seq: {
                [Op.in]: results.map((item) => item.seq),
            },
        },
    })

    res.status(HttpStatusCodes.OK).send(orders)
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

router.post('/collect/:seq', async (req, res) => {
    const payments = req.body as PaymentCreationAttributes[]
    const seq = converNumRes(req.params.seq, res)

    const result = await OrderService.collect(seq, payments)
    if (result == null) {
        res.status(HttpStatusCodes.BAD_GATEWAY).send(ResponseError.get(Codes.NOT_EXIST_ID))
        return
    }

    res.status(HttpStatusCodes.CREATED).send({ order: result.order, payments: result.payments })
})

router.post('/collect', async (req, res) => {
    const arr = req.body as { seq: number; payments: PaymentCreationAttributes[] }[]

    const resDataList = await Promise.all(
        arr.map((item) => {
            return OrderService.collect(item.seq, item.payments)
        }),
    )
    if (resDataList.includes(null)) res.status(HttpStatusCodes.BAD_REQUEST).send(ResponseError.get(Codes.NOT_EXIST_ID))

    res.status(HttpStatusCodes.CREATED).send(resDataList)
})

router.post('/cancelCollect/:seq', async (req, res) => {
    const seq = converNumRes(req.params.seq, res)
    const result = await OrderService.cancelCollect(seq)
    if (result == null) {
        res.status(HttpStatusCodes.BAD_REQUEST).send(ResponseError.get(Codes.NOT_EXIST_ID))
        return
    }

    res.status(HttpStatusCodes.OK).send({ order: result.order, paymentSeqs: result.paymentSeqs })
})

router.post('/cancelCollect', async (req, res) => {
    const seqs = req.body as number[]

    const results = await Promise.all(
        seqs.map((seq) => {
            return OrderService.cancelCollect(seq)
        }),
    )

    if (results.includes(null)) res.status(HttpStatusCodes.BAD_REQUEST).send(ResponseError.get(Codes.NOT_EXIST_ID))

    res.status(HttpStatusCodes.OK).send(results)
})

// 주문 변경
router.patch('/:seq', async (req, res) => {
    const seq = +req.params.seq
    const { order, orderMenues = [] } = req.body as {
        order: MyOrderAttributes
        orderMenues: OrderMenuAttributes[]
    }

    await DB.sequelize.transaction(async () => {
        const prms = [MyOrder.update(order, { where: { seq } })] as Promise<any>[]
        // 주문 메뉴가 있으면 기존 데이터 삭제 후 등록
        if (orderMenues.length > 0) {
            await OrderMenu.destroy({ where: { orderSeq: seq } })
            prms.push(...orderMenues.map((om) => OrderMenu.create(om)))
        }

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
