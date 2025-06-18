import { Router } from 'express';
import { UsersController } from './users.controller';
import { requirePermission } from '@/shared/middleware/auth-middleware';

const router = Router();

router.get('/', requirePermission('user_read'), UsersController.listUsers);
router.get('/:id', requirePermission('user_read'), UsersController.getUser);
router.post('/', requirePermission('user_create'), UsersController.createUser);
router.put('/:id', requirePermission('user_update'), UsersController.updateUser);
router.delete('/:id', requirePermission('user_delete'), UsersController.deleteUser);
router.patch('/:id/password', requirePermission('user_update'), UsersController.changePassword);
router.patch('/:id/roles', requirePermission('role_update'), UsersController.assignRoles);

export { router as usersRoutes }; 