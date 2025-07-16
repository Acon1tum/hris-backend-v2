import { Router } from 'express';
import { jobPortalController } from './job-portal.controller';

const router = Router();

// Applicant Authentication & Profile
router.post('/register', jobPortalController.register.bind(jobPortalController));
router.post('/login', jobPortalController.login.bind(jobPortalController));
router.get('/profile', jobPortalController.getProfile.bind(jobPortalController));
router.put('/profile', jobPortalController.updateProfile.bind(jobPortalController));
router.get('/profile/completion-status', jobPortalController.checkProfileCompletion.bind(jobPortalController));

// Job Listings
router.get('/jobs', jobPortalController.listJobs.bind(jobPortalController));
router.get('/jobs/:id', jobPortalController.getJob.bind(jobPortalController));

// Job Application Process
router.post('/applications', jobPortalController.startApplication.bind(jobPortalController));
router.post('/applications/:id/upload', jobPortalController.uploadDocuments.bind(jobPortalController));
router.put('/applications/:id/answers', jobPortalController.answerQuestions.bind(jobPortalController));
router.post('/applications/:id/submit', jobPortalController.submitApplication.bind(jobPortalController));

// Application Summary & Status
router.get('/applications', jobPortalController.listApplications.bind(jobPortalController));
router.get('/applications/:id', jobPortalController.getApplication.bind(jobPortalController));

// Edit/Cancel Application
router.put('/applications/:id', jobPortalController.editApplication.bind(jobPortalController));
router.delete('/applications/:id', jobPortalController.cancelApplication.bind(jobPortalController));

// Notifications
router.post('/notifications', jobPortalController.notifyApplicant.bind(jobPortalController));

export { router as jobPortalRoutes }; 