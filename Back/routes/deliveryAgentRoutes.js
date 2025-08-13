import express from 'express';
import { registerAgent, loginAgent, updateAgentStatus, updateAgentLocation, getAgentProfile } from '../controllers/deliveryAgentController.js';
import { protectAgent } from '../middleware/agentAuthMiddleware.js';

const router = express.Router();

router.post('/register', registerAgent);
router.post('/login', loginAgent);
router.get('/profile', protectAgent, getAgentProfile);
router.put('/status', protectAgent, updateAgentStatus);
router.put('/location', protectAgent, updateAgentLocation);

export default router;