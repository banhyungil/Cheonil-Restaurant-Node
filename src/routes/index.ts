import { Router } from 'express'
import jetValidator from 'jet-validator'
import Paths from '../common/Paths'
import menuRouter from './menu'
import menuCategoryRouter from './menuCategory'
import storeRouter from './store'
import storeCategoryRouter from './storeCategory'
import orderRouter from './order'
import paymentRouter from './payment'
import placeCategoryRouter from './placeCategory'
import supplyRouter from './supply'
import productInfoRouter from './productInfo'
import unitRouter from './unit'
import settingRouter from './setting'
import productRouter from './product'
import expenseRouter from './expense'

const apiRouter = Router(),
    validate = jetValidator()

apiRouter.use(Paths.Menu, menuRouter)
apiRouter.use(Paths.MenuCategory, menuCategoryRouter)
apiRouter.use(Paths.Store, storeRouter)
apiRouter.use(Paths.StoreCategory, storeCategoryRouter)
apiRouter.use(Paths.Order, orderRouter)
apiRouter.use(Paths.Payment, paymentRouter)
apiRouter.use(Paths.PlaceCategory, placeCategoryRouter)
apiRouter.use(Paths.Supply, supplyRouter)
apiRouter.use(Paths.ProductInfo, productInfoRouter)
apiRouter.use(Paths.Unit, unitRouter)
apiRouter.use(Paths.Product, productRouter)
apiRouter.use(Paths.Expense, expenseRouter)
apiRouter.use(Paths.Setting, settingRouter)

export default apiRouter
