import development from './development'
import product from './product'

const conifg = process.env.PRODUCT == 'product' ? product : development
export default conifg
