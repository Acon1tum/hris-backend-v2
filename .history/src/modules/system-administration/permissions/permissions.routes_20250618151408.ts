import { Router } from 'express';
import { PermissionsController } from './permissions.controller';
import { requirePermission } from '@/shared/middleware/auth-middleware';

const router = Router();

// List all possible permissions
router.get('/permissions', requirePermission('permission_read'), PermissionsController.listPermissions);

// List all roles
router.get('/roles', requirePermission('role_read'), PermissionsController.listRoles);

// List permissions for a specific role
router.get('/roles/:id/permissions', requirePermission('role_read'), PermissionsController.getRolePermissions);

// Set permissions for a role (replace all)
router.post('/roles/:id/permissions', requirePermission('role_update'), PermissionsController.setRolePermissions);

// Remove a single permission from a role
router.delete('/roles/:id/permissions/:perm', requirePermission('role_update'), PermissionsController.removeRolePermission);

// List effective permissions for a user
router.get('/users/:id/permissions', requirePermission('user_read'), PermissionsController.getUserPermissions);

export { router as permissionsRoutes }; 