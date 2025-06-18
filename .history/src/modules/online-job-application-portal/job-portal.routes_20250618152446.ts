import { Router } from 'express';

const router = Router();

// Placeholder routes for online job application portal module
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Online Job Application Portal module - Coming soon'
  });
});

export { router as jobPortalRoutes }; 