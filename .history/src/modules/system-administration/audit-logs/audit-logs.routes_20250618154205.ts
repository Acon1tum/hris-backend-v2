import { Router } from 'express';
import { AuditLogsController } from './audit-logs.controller';
import { requirePermission } from '@/shared/middleware/auth-middleware';

const router = Router();

router.get('/', requirePermission('audit_log_read'), AuditLogsController.listLogs);
router.get('/:id', requirePermission('audit_log_read'), AuditLogsController.getLog);

export { router as auditLogsRoutes }; 