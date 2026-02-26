import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';

const router = express.Router();

// Route 1: Register a new user
// URL will be: POST /api/auth/register
router.post('/register', registerUser);

// Route 2: Login an existing user
// URL will be: POST /api/auth/login
router.post('/login', loginUser);

export default router;