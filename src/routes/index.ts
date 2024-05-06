import express from 'express'
import menuRouter from './menu.ts'
import menuCategoryRouter from './menuCategory.ts'
import storeRouter from './store.ts'
import storeCategoryRouter from './storeCategory.ts'
import orderRouter from './order.ts'
// import { fileURLToPath } from 'url'
const router = express.Router()

/* GET home page. */
router.get('/', (req, res) => {
    // res.sendFile(fileURLToPath(import.meta.url))
})

router.use('/menu', menuRouter)
router.use('/menuCategory', menuCategoryRouter)
router.use('/store', storeRouter)
router.use('/storeCategory', storeCategoryRouter)
router.use('/order', orderRouter)

export default router
