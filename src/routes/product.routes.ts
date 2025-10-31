import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';

const router = Router();

router.post('/', ProductController.addProduct); 
router.patch('/', ProductController.updateProduct); 
router.get('/', ProductController.getProducts); 
router.get('/search', ProductController.searchProducts); 
router.get('/reorder', ProductController.getProductsNeedingReorder); 
router.get('/category/:categoryId', ProductController.getProductsByCategory); 
router.get('/:id', ProductController.getProductById); 
router.patch('/:id/stock', ProductController.updateProductStock); 
router.delete('/:id', ProductController.softDeleteProduct); 
router.patch('/restore/:id', ProductController.restoreProduct); 

export default router;
