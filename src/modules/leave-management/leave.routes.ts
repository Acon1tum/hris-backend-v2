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

// GET /api/leave/applications - Get leave applications with filters
router.get('/applications', 
  requirePermission('leave_request_read'), 
  LeaveController.getLeaveApplications
);

// GET /api/leave/applications/my - Get logged-in user's leave applications
router.get('/applications/my', 
  authMiddleware, 
  LeaveController.getMyLeaveApplications
);

// GET /api/leave/applications/pending - Get pending applications for approval
router.get('/applications/pending', 
  requirePermission('leave_request_read'), 
  LeaveController.getPendingApplications
);

// POST /api/leave/applications - Create leave application
router.post('/applications', 
  requirePermission('leave_request_create'), 
  LeaveController.createLeaveApplication
);

// PUT /api/leave/applications/:id - Update leave application
router.put('/applications/:id', 
  requirePermission('leave_request_update'), 
  LeaveController.updateLeaveApplication
);

// DELETE /api/leave/applications/:id - Cancel leave application
router.delete('/applications/:id', 
  requirePermission('leave_request_delete'), 
  LeaveController.cancelLeaveApplication
);

// PUT /api/leave/applications/:id/approve - Approve leave application
router.put('/applications/:id/approve', 
  requirePermission('leave_request_update'), 
  LeaveController.approveLeaveApplication
);

// PUT /api/leave/applications/:id/reject - Reject leave application
router.put('/applications/:id/reject', 
  requirePermission('leave_request_update'), 
  LeaveController.rejectLeaveApplication
);

// ==================== LEAVE TYPES ====================

// GET /api/leave/types - Get all leave types
router.get('/types', 
  requirePermission('leave_type_read'), 
  LeaveController.getLeaveTypes
);

// POST /api/leave/types - Create leave type
router.post('/types', 
  requirePermission('leave_type_create'), 
  LeaveController.createLeaveType
);

// PUT /api/leave/types/:id - Update leave type
router.put('/types/:id', 
  requirePermission('leave_type_update'), 
  LeaveController.updateLeaveType
);

// DELETE /api/leave/types/:id - Delete leave type
router.delete('/types/:id', 
  requirePermission('leave_type_delete'), 
  LeaveController.deleteLeaveType
);

// ==================== LEAVE BALANCE ====================

// GET /api/leave/balance/my - Get logged-in user's leave balance
router.get('/balance/my', 
  authMiddleware, 
  LeaveController.getMyLeaveBalance
);

// GET /api/leave/balance/:personnel_id - Get personnel's leave balance
router.get('/balance/:personnel_id', 
  requirePermission('leave_balance_read'), 
  LeaveController.getPersonnelLeaveBalance
);

// POST /api/leave/balance/initialize - Initialize leave balances
router.post('/balance/initialize', 
  requirePermission('leave_balance_create'), 
  LeaveController.initializeLeaveBalance
);

// ==================== LEAVE MONETIZATION ====================

// GET /api/leave/monetization - Get leave monetization requests
router.get('/monetization', 
  requirePermission('leave_request_read'), 
  LeaveController.getLeaveMonetization
);

// POST /api/leave/monetization - Create leave monetization request
router.post('/monetization', 
  requirePermission('leave_request_create'), 
  LeaveController.createLeaveMonetization
);

// PUT /api/leave/monetization/:id/approve - Approve leave monetization
router.put('/monetization/:id/approve', 
  requirePermission('leave_request_update'), 
  LeaveController.approveLeaveMonetization
);

// ==================== LEAVE REPORTS ====================

// GET /api/leave/reports/summary - Get leave summary report
router.get('/reports/summary', 
  requirePermission('leave_report_read'), 
  LeaveController.getLeaveSummaryReport
);

// GET /api/leave/reports/balance - Get leave balance report
router.get('/reports/balance', 
  requirePermission('leave_report_read'), 
  LeaveController.getLeaveBalanceReport
);

// ==================== LEAVE CREDIT ADJUSTMENTS ====================

// POST /api/leave/adjustments - Create leave credit adjustment
router.post('/adjustments', 
  requirePermission('leave_balance_update'), 
  LeaveController.createLeaveAdjustment
);

// GET /api/leave/adjustments - Get leave credit adjustments
router.get('/adjustments', 
  requirePermission('leave_balance_read'), 
  LeaveController.getLeaveAdjustments
);

// GET /api/leave/adjustments/:personnel_id - Get adjustments for specific personnel
router.get('/adjustments/:personnel_id', 
  requirePermission('leave_balance_read'), 
  LeaveController.getPersonnelAdjustments
);

export { router as leaveRoutes }; 