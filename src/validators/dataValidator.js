import Joi from 'joi';

// Define the validation schema for a ticket
export const dataSchema = Joi.object({
    Type: Joi.string().required(),
    StartDate: Joi.string().required(),
    EndDate: Joi.string().required(),
    UserId: Joi.string().required(),
    Role: Joi.string().required(),
});
