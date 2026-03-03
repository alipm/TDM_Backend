import express from "express";
import { dataController } from '../controllers/dataController.js';
import { authenticateJWT } from "../middlewares/authMiddleware.js";
import { dataSchema } from '../validators/dataValidator.js';
import { validateRequest } from '../middlewares/validateRequest.js';

const router = express.Router();

// Routes
router.post('/getCustomerTicketData', authenticateJWT, validateRequest(dataSchema), dataController);

export default router;
