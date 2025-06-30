import { Router } from 'express';
import { DepartmentsController } from './departments.controller';
import { requirePermission } from '@/shared/middleware/auth-middleware';

const router = Router();

// Get all departments
router.get('/', 
  requirePermission('employee_read'), 
  DepartmentsController.getAllDepartments
);

// Get department by ID
router.get('/:id', 
  requirePermission('employee_read'), 
  DepartmentsController.getDepartmentById
);

// Create new department
router.post('/', 
  requirePermission('employee_create'), 
  DepartmentsController.createDepartment
);

// Update department
router.put('/:id', 
  requirePermission('employee_update'), 
  DepartmentsController.updateDepartment
);

// Delete department
router.delete('/:id', 
  requirePermission('employee_delete'), 
  DepartmentsController.deleteDepartment
);

export { router as departmentsRoutes }; 