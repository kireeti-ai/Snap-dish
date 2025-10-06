import express from 'express';
import * as creatorController from '../controllers/creatorApplicationController.js';

const router = express.Router();

// Route for the public-facing submission form
router.post('/submit', creatorController.submitApplication);

// Routes for the admin panel to manage applications
router.get('/', creatorController.getAllApplications);
router.patch('/:id/status', creatorController.updateApplicationStatus);

export default router;