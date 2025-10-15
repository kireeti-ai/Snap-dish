import express from 'express';
import * as creatorController from '../controllers/creatorApplicationController.js';

const router = express.Router();


router.post('/submit', creatorController.submitApplication);

router.get('/', creatorController.getAllApplications);
router.patch('/:id/status', creatorController.updateApplicationStatus);

export default router;