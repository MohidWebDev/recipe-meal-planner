import { Router } from 'express';
import { register, login, getMe } from '../controllers/auth.controller.js';
import { registerRules, loginRules } from '../validators/auth.validator.js';
import validate from '../middleware/validate.js';
import protect from '../middleware/auth.js';

const router = Router();

router.post('/register', registerRules, validate, register);
router.post('/login', loginRules, validate, login);
router.get('/me', protect, getMe);

export default router;
