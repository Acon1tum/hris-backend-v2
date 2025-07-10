import { Router } from 'express';
import { employeeSelfServiceController } from './employee-self-service.controller';
import { authMiddleware } from '../../shared/middleware/auth-middleware';

const router = Router();

// Placeholder routes for employee self service module
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Employee Self Service module - Coming soon'
  });
});

// GET /api/employee-self-service/my-profile - Get logged-in user's profile
router.get('/my-profile', authMiddleware, employeeSelfServiceController.getMyProfile);

// PUT /api/employee-self-service/my-profile - Update logged-in user's profile
router.put('/my-profile', authMiddleware, employeeSelfServiceController.updateMyProfile);

export { router as employeeSelfServiceRoutes }; 