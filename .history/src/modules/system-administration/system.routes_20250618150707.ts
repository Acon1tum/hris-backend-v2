import { Router } from 'express';

const router = Router();

// Placeholder routes for system administration module
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'System Administration module - Coming soon'
  });
});

export { router as systemRoutes }; 