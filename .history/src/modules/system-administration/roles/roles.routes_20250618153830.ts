import { Router } from 'express';
import { RolesController } from './roles.controller';
import { requirePermission } from '@/shared/middleware/auth-middleware';

const router = Router();

router.get('/', requirePermission('role_read'), RolesController.listRoles);
router.get('/:id', requirePermission('role_read'), RolesController.getRole);
router.post('/', requirePermission('role_create'), RolesController.createRole);
router.put('/:id', requirePermission('role_update'), RolesController.updateRole);
router.delete('/:id', requirePermission('role_delete'), RolesController.deleteRole);
router.patch('/:id/permissions', requirePermission('permission_update'), RolesController.assignPermissions);

export { router as rolesRoutes }; 