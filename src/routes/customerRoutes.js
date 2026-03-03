import express from "express";
import { createCustomerController } from '../controllers/customerController';
import { authenticateJWT } from "../middlewares/authMiddleware";
import { customerSchema } from "../validators/customerValidator";
import { validateRequest } from "../middlewares/validateRequest";

const router = express.Router();

// Routes
router.post('/customer-create', authenticateJWT, validateRequest(customerSchema), createCustomerController);

export default router;
