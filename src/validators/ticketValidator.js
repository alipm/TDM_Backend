import Joi from 'joi';

// Define the validation schema for a ticket
export const baseTicketSchema = Joi.object({
    Customer_ID: Joi.string().required(),
    Environment: Joi.string().required(),
    Category: Joi.string().required(),
    Sub_Category: Joi.string().required(),
    Waste_Type: Joi.string().required(),
    Swappable_Flag: Joi.boolean().required(),  // Ensures true/false only
    Dispatch_Date: Joi.string().required(),
    Transaction_ID: Joi.number().required()
    // Dispatch_Date: Joi.date().required().iso(), // Validates as ISO date
});

export const singleTicketSchema = baseTicketSchema.keys({
    createdby: Joi.string().required() // `createdby` is required for single-ticket API
});


// Define validation for bulk ticket (an array of ticket objects)
export const bulkTicketSchema = Joi.object({
    type: Joi.string().valid('ticket').required(),
    createdby: Joi.string().required(), // `createdby` is required at the top level
    // tableData: Joi.array().items(ticketSchema).required(),  // Validate each ticket inside the array
    tableData: Joi.array().items(baseTicketSchema.fork('Transaction_ID', (schema) => schema.forbidden())).required(),  // Remove transactionID from bulk insert
});
