import { Router } from 'express';
import jetValidator from 'jet-validator';
import Paths from '../common/Paths';
import menuRouter from './menu'
import menuCategoryRouter from './menuCategory'
import storeRouter from './store'
import storeCategoryRouter from './storeCategory'
import orderRouter from './order'
import placeCategoryRouter from './placeCategory'
// import { fileURLToPath } from 'url'
const apiRouter = Router(),
    validate = jetValidator()


apiRouter.use(Paths.Menu, menuRouter)
apiRouter.use(Paths.MenuCategory, menuCategoryRouter)
apiRouter.use(Paths.Store, storeRouter)
apiRouter.use(Paths.StoreCategory, storeCategoryRouter)
apiRouter.use(Paths.Order, orderRouter)
apiRouter.use(Paths.PlaceCategory, placeCategoryRouter)

export default apiRouter

