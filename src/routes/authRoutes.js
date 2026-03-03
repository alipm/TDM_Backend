import express from "express";
const { verifyAdmin, authenticateJWT } = require('../middlewares/authMiddleware');
import { userSchema, updateUserSchema } from '../validators/userValidator.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { loginUserController, createUser, fetchUser, updateUser, deleteUser } from
    '../controllers/authController';

const router = express.Router();

// Routes
router.post('/login', loginUserController);
router.post('/createUser',  authenticateJWT, validateRequest(userSchema), createUser);
router.get('/fetchUser', authenticateJWT, fetchUser);
router.post('/updateUser', authenticateJWT, validateRequest(updateUserSchema), updateUser);
router.post('/deleteUser', authenticateJWT, deleteUser);

export default router;
