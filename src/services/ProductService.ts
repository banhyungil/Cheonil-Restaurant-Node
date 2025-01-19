import DB from '@src/models'
import { PaymentCreationAttributes } from '@src/models/Payment'
import { Op } from 'sequelize'

const { Product, ProductInfo, Unit } = DB.Models
async function selectProducts(seqs: number[]) {
    const products = await Product.findAll({
        include: [
            {
                model: ProductInfo,
                as: 'prdInfo',
            },
            {
                model: Unit,
                as: 'unit',
            },
        ],
        where: {
            seq: { [Op.in]: seqs },
        },
    })

    return products
}

export default { selectProducts }
