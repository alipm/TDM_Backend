import { createCustomer } from "../services/customerService";
import asyncHandler from "../middlewares/asyncHandler";
import { MESSAGES } from "../config/messages";

export const createCustomerController = asyncHandler(async (req, res, next) => {
    const payload = req.body;

    // Call service to create a customer and related data
    const customerData = await createCustomer(payload);
    res.status(201).json({ message: MESSAGES.CUSTOMER_CREATED_SUCCESS, data: customerData });
});