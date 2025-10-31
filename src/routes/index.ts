import { Router } from 'express';
import userRoutes from './user.route';
import supplierRoutes from './supplier.route'
import productCategoryRoutes from './product_category.route';
import productRoutes from './product.routes'

const router = Router();

router.use('/users', userRoutes);
router.use('/supplier', supplierRoutes);
router.use('/product-categories', productCategoryRoutes);
router.use('/products', productRoutes);


export default router;
