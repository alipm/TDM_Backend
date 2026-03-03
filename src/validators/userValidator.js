import Joi from 'joi';

// Define the validation schema for a ticket
export const userSchema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
    status: Joi.string().required(),
    last_modified_by: Joi.string().required()
});

export const updateUserSchema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().required(),
    status: Joi.string().required(),
    last_modified_by: Joi.string().required(),
    user_id: Joi.string().required()
});