import { Router } from 'express';
import { permissionsRoutes } from './permissions/permissions.routes';

const router = Router();

// Mount permissions management endpoints
router.use('/', permissionsRoutes);

// Placeholder routes for system administration module
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'System Administration module - Coming soon'
  });
});

export { router as systemRoutes }; 