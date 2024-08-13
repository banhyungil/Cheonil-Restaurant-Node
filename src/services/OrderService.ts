import DB from '@src/models'

const { MyOrder, OrderMenu, Menu } = DB.Models
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

export default { getOrder }
