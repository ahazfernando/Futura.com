import express from 'express';
import { createUser, loginUser, logoutCurrentUser, getAllUsers } from '../controllers/userController.js';
import { authenticate, authorizeAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Route for creating a new user
router.route('/').post(createUser).get(authenticate, authorizeAdmin, getAllUsers);

// Route for logging in a user
router.post('/auth', loginUser);

// Route for logging out a user
router.post('/logout', logoutCurrentUser);

export default router;
