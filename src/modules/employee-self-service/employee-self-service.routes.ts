import { Router } from 'express';

const router = Router();

// Placeholder routes for employee self service module
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Employee Self Service module - Coming soon'
  });
});

export { router as employeeSelfServiceRoutes }; 