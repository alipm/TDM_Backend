import express from "express";
import { createTicketController } from '../controllers/ticketController';
import { authenticateJWT } from "../middlewares/authMiddleware";
import { singleTicketSchema, bulkTicketSchema } from '../validators/ticketValidator.js';
import { validateRequest } from '../middlewares/validateRequest.js';

const router = express.Router();

// Routes
router.post('/ticket-create', authenticateJWT, validateRequest(singleTicketSchema), createTicketController);
router.post('/ticket-bulk-create', authenticateJWT, validateRequest(bulkTicketSchema), createTicketController);

export default router;
