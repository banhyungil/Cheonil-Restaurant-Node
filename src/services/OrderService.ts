import DB from '@src/models'

const { MyOrder, OrderMenu } = DB.models
async function getOrder(seq: number) {
    const nMyOrder = await MyOrder.findOne({
        include: [
            {
                model: OrderMenu,
                as: 'orderMenues',
            },
        ],
        where: {
            seq,
        },
    })

    return nMyOrder
}

export default { getOrder }