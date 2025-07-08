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

// Employment History
router.get('/:id/employment-history', requirePermission('employment_history_read'), PersonnelController.getEmploymentHistory);
router.post('/:id/employment-history', requirePermission('employment_history_create'), PersonnelController.addEmploymentHistory);

// Membership Data
router.get('/:id/membership-data', requirePermission('membership_data_read'), PersonnelController.getMembershipData);
router.patch('/:id/membership-data', requirePermission('membership_data_update'), PersonnelController.updateMembershipData);

// Merits & Violations
router.get('/:id/merits-violations', requirePermission('merit_read'), PersonnelController.getMeritsViolations);
router.post('/:id/merits-violations', requirePermission('merit_create'), PersonnelController.addMeritViolation);

// Administrative Cases
router.get('/:id/admin-cases', requirePermission('admin_case_read'), PersonnelController.getAdministrativeCases);
router.post('/:id/admin-cases', requirePermission('admin_case_create'), PersonnelController.addAdministrativeCase);

// Personnel Movement
router.get('/:id/movements', requirePermission('employee_read'), PersonnelController.getPersonnelMovements);
router.post('/:id/movements', requirePermission('employee_update'), PersonnelController.addPersonnelMovement);

// Get simplified employee list for admin dashboard
router.get('/dashboard-employees', requirePermission('employee_read'), PersonnelController.getDashboardEmployees);

export { router as personnelRoutes }; 