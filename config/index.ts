import development from './development.ts'
import product from './product.ts'

const conifg = process.env.PRODUCT == 'product' ? product : development
export default conifg
