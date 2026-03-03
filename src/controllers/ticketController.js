import { createTicket, bulkInsertTicket } from "../services/ticketService";
import asyncHandler from "../middlewares/asyncHandler";
import { MESSAGES } from "../config/messages";

export const createTicketController = asyncHandler(async (req, res, next) => {
    const payload = req.body;

    // Handle single ticket creation if the payload is not an array
    if (!Array.isArray(payload.tableData)) {
        const ticketData = await createTicket(payload);
        return res.status(201).json({
            message: MESSAGES.TICKET_CREATED_SUCCESS,
            data: ticketData
        });
    }

    // Handle bulk ticket creation if the payload is an array (tableData)
    const { insertedIds, errors } = await bulkInsertTicket({ records: payload.tableData, createdby : payload.createdby });
    return res.status(200).json({
        message: MESSAGES.ALL_DATA_SAVED,
        successCount: insertedIds.length,
        errors
    });
});