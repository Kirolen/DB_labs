import { Router } from 'express';
import { UserController } from '../controllers/user.controller';

const router = Router();

router.post('/', UserController.addUser);
router.patch('/', UserController.updateUser);
router.get('/', UserController.getUsers);
router.get('/:id', UserController.getUserById);
router.delete('/:id', UserController.softDeleteUser);


export default router;
