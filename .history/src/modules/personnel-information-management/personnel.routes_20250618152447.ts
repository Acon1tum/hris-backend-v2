import { Router } from 'express';
import { PersonnelController } from './personnel.controller';
import { requirePermission } from '@/shared/middleware/auth-middleware';

const router = Router();

// Get all personnel with pagination and filters
router.get('/', 
  requirePermission('employee_read'), 
  PersonnelController.getAllPersonnel
);

// Get personnel statistics
router.get('/stats', 
  requirePermission('employee_read'), 
  PersonnelController.getPersonnelStats
);

// Get personnel by ID
router.get('/:id', 
  requirePermission('employee_read'), 
  PersonnelController.getPersonnelById
);

// Create new personnel
router.post('/', 
  requirePermission('employee_create'), 
  PersonnelController.createPersonnel
);

// Update personnel
router.put('/:id', 
  requirePermission('employee_update'), 
  PersonnelController.updatePersonnel
);

// Delete personnel
router.delete('/:id', 
  requirePermission('employee_delete'), 
  PersonnelController.deletePersonnel
);

export { router as personnelRoutes }; 