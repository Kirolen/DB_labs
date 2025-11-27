import { Router } from 'express';
import userRoutes from './user.route';
import supplierRoutes from './supplier.route'
import productCategoryRoutes from './product_category.route';
import productRoutes from './product.routes'
import mongoRoutes from './mongo.route';
import redisRoutes from "./redis.route";
import performanceRoutes from "./performance.route";

const router = Router();

router.use('/users', userRoutes);
router.use('/supplier', supplierRoutes);
router.use('/product-categories', productCategoryRoutes);
router.use('/products', productRoutes);
router.use('/mongo', mongoRoutes); 
router.use('/performance', performanceRoutes);
router.use("/redis", redisRoutes);
export default router;

