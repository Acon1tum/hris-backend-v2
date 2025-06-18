import { Router } from 'express';
import { permissionsRoutes } from './permissions/permissions.routes';
import { usersRoutes } from './users/users.routes';
import { rolesRoutes } from './roles/roles.routes';

const router = Router();

// Mount permissions management endpoints
router.use('/permissions', permissionsRoutes);
router.use('/users', usersRoutes);
router.use('/roles', rolesRoutes);

// Placeholder routes for system administration module
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'System Administration module - API root'
  });
});

export { router as systemRoutes }; 