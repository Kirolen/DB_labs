import { Router } from 'express';
import { ProductCategoryController } from '../controllers/product_category.controller';

const router = Router();

router.post('/', ProductCategoryController.addProductCategory); 
router.patch('/', ProductCategoryController.updateProductCategory); 
router.get('/', ProductCategoryController.getProductCategories); 
router.get('/:id', ProductCategoryController.getProductCategoryById); 
router.get('/:id/hierarchy', ProductCategoryController.getCategoryHierarchy); 
router.delete('/:id', ProductCategoryController.softDeleteProductCategory); 
router.patch('/restore/:id', ProductCategoryController.restoreProductCategory); 

export default router;
