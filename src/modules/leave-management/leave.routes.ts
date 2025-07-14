import { Router } from 'express';
import { LeaveController } from './leave.controller';
import { authMiddleware, requirePermission } from '@/shared/middleware/auth-middleware';

const router = Router();

// Placeholder routes for leave management module
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Leave Management module - API ready'
  });
});

// ==================== LEAVE APPLICATIONS ====================

// GET /api/leave-management/applications - Get leave applications with filters
router.get('/applications', 
  requirePermission('leave_request_read'), 
  LeaveController.getLeaveApplications
);

// GET /api/leave-management/applications/my - Get logged-in user's leave applications
router.get('/applications/my', 
  authMiddleware, 
  LeaveController.getMyLeaveApplications
);

// GET /api/leave-management/applications/pending - Get pending applications for approval
router.get('/applications/pending', 
  requirePermission('leave_request_read'), 
  LeaveController.getPendingApplications
);

// POST /api/leave-management/applications - Create leave application
router.post('/applications', 
  requirePermission('leave_request_create'), 
  LeaveController.createLeaveApplication
);

// PUT /api/leave-management/applications/:id - Update leave application
router.put('/applications/:id', 
  requirePermission('leave_request_update'), 
  LeaveController.updateLeaveApplication
);

// DELETE /api/leave-management/applications/:id - Cancel leave application
router.delete('/applications/:id', 
  requirePermission('leave_request_delete'), 
  LeaveController.cancelLeaveApplication
);

// PUT /api/leave-management/applications/:id/approve - Approve leave application
router.put('/applications/:id/approve', 
  requirePermission('leave_request_update'), 
  LeaveController.approveLeaveApplication
);

// PUT /api/leave-management/applications/:id/reject - Reject leave application
router.put('/applications/:id/reject', 
  requirePermission('leave_request_update'), 
  LeaveController.rejectLeaveApplication
);

// ==================== LEAVE TYPES ====================

// GET /api/leave-management/types - Get all active leave types
router.get('/types', 
  requirePermission('leave_type_read'), 
  LeaveController.getLeaveTypes
);

// POST /api/leave-management/types - Create leave type
router.post('/types', 
  requirePermission('leave_type_create'), 
  LeaveController.createLeaveType
);

// PUT /api/leave-management/types/:id - Update leave type
router.put('/types/:id', 
  requirePermission('leave_type_update'), 
  LeaveController.updateLeaveType
);

// DELETE /api/leave-management/types/:id - Deactivate leave type
router.delete('/types/:id', 
  requirePermission('leave_type_delete'), 
  LeaveController.deleteLeaveType
);

// ==================== LEAVE BALANCE ====================

// GET /api/leave-management/balance/my - Get logged-in user's leave balance
router.get('/balance/my', 
  authMiddleware, 
  LeaveController.getMyLeaveBalance
);

// GET /api/leave-management/balance/:personnel_id - Get personnel's leave balance
router.get('/balance/:personnel_id', 
  requirePermission('leave_balance_read'), 
  LeaveController.getPersonnelLeaveBalance
);

// POST /api/leave-management/balance/initialize - Initialize leave balances
router.post('/balance/initialize', 
  requirePermission('leave_balance_create'), 
  LeaveController.initializeLeaveBalance
);

// ==================== LEAVE MONETIZATION ====================

// GET /api/leave-management/monetization - Get leave monetization requests
router.get('/monetization', 
  requirePermission('leave_request_read'), 
  LeaveController.getLeaveMonetization
);

// POST /api/leave-management/monetization - Create leave monetization request
router.post('/monetization', 
  requirePermission('leave_request_create'), 
  LeaveController.createLeaveMonetization
);

// PUT /api/leave-management/monetization/:id/approve - Approve leave monetization
router.put('/monetization/:id/approve', 
  requirePermission('leave_request_update'), 
  LeaveController.approveLeaveMonetization
);

// ==================== LEAVE REPORTS ====================

// GET /api/leave-management/reports/summary - Get leave summary report
router.get('/reports/summary', 
  requirePermission('leave_report_read'), 
  LeaveController.getLeaveSummaryReport
);

// GET /api/leave-management/reports/balance - Get leave balance report
router.get('/reports/balance', 
  requirePermission('leave_report_read'), 
  LeaveController.getLeaveBalanceReport
);

export { router as leaveRoutes }; 