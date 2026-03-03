import { getData } from "../services/dataService";
import asyncHandler from "../middlewares/asyncHandler";
import { MESSAGES } from "../config/messages";

export const dataController = asyncHandler(async (req, res, next) => {
    const payload = req.body;

    // Handle single ticket creation if the payload is not an array
    const data = await getData(payload);
    return res.status(201).json({
        message: MESSAGES.RETRIEVED_DATA,
        data: data
    });
});