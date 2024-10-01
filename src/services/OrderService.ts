import DB from '@src/models'
import { PaymentCreationAttributes } from '@src/models/Payment'
import { Op } from 'sequelize'

const { MyOrder, OrderMenu, Menu, Payment } = DB.Models
async function getOrder(seq: number) {
    const nMyOrder = await MyOrder.findOne({
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
        ],
        where: {
            seq,
        },
    })

    return nMyOrder
}

/**
 * 수금
 * @returns null: 해당 order가 존재하지 않은 경우
 */
async function collect(seq: number, payments: PaymentCreationAttributes[]) {
    const order = await MyOrder.findOne({ where: { seq } })
    if (order == null) return null

    const nPayments = await Promise.all(
        payments.map((pm) => {
            return Payment.create(pm)
        }),
    )
    order.status = 'PAID'
    await order.save()

    return { order: order.toJSON(), payments: nPayments.map((pm) => pm.toJSON()) }
}

/**
 * 수금 취소
 * @returns null: 해당 order가 존재하지 않은 경우
 */
async function cancelCollect(seq: number) {
    const order = await MyOrder.findOne({
        include: {
            model: Payment,
            as: 'payments',
        },
        where: { seq },
    })
    if (order == null) return null

    const paymentSeqs = order.payments?.map((p) => p.seq)
    if (Array.isArray(order.payments)) {
        await Payment.destroy({
            where: {
                seq: {
                    [Op.in]: paymentSeqs,
                },
            },
        })
    }

    order.status = 'COOKED'
    await order.save()
    const uOrder = order.get({ plain: true })
    delete uOrder.payments

    return { order: uOrder, paymentSeqs }
}

export default { getOrder, collect, cancelCollect }
