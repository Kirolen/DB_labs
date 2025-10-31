import { Router } from 'express';
import { SupplierController } from '../controllers/supplier.controller';

const router = Router();

router.post('/', SupplierController.addSupplier);
router.patch('/', SupplierController.updateSupplier);
router.get('/', SupplierController.getSuppliers);
router.get('/:id', SupplierController.getSupplierById);
router.delete('/:id', SupplierController.softDeleteSupplier);
router.patch('/restore/:id', SupplierController.restoreSupplier)


export default router;
