import { Router } from 'express';

const router = Router();

// Placeholder routes for learning and development module
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Learning and Development module - Coming soon'
  });
});

export { router as learningRoutes }; 