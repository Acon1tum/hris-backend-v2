import { Router } from 'express';

const router = Router();

// Placeholder routes for leave management module
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Leave Management module - Coming soon'
  });
});

export { router as leaveRoutes }; 