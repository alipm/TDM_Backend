import Joi from 'joi';

// Define the validation schema for a customer
export const customerSchema = Joi.object({
    customerConfig: Joi.object({
        customerType: Joi.string().valid('R', 'C', 'O').required(), // Customer type as ENUM
        environment: Joi.string().required(),
        MASlibrary: Joi.string().required(),
        companyCode: Joi.string().required()
    }).required(),
    
    customerBio: Joi.object({
        name: Joi.string().required(),
        contact: Joi.string().required(),
        address: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().required(),
        zipcode: Joi.string().required(),
        email: Joi.string().email().required(),
        // phone: Joi.string().pattern(/^[0-9]{10,15}$/).required() // Ensures phone is numeric and of valid length
        phone: Joi.string().required()
    }).required(),
    
    serviceAddress: Joi.object({
        name: Joi.string().required(),
        contact: Joi.string().required(),
        address: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().required(),
        zipcode: Joi.string().required(),
        email: Joi.string().email().required(),
        phone: Joi.string().required()
    }).required(),
    
    billingInfo: Joi.object({
        // billingCycle: Joi.string().valid('monthly', 'quarterly', 'yearly').required(), // Enum for billing cycle
        billingCycle: Joi.string().required(),
        startDate: Joi.string().required(), // Ensures ISO 8601 date format
        contractType: Joi.string().required(),
        // contractDate: Joi.date().iso().required(),
        contractDate: Joi.string().required(),
        countryCode: Joi.string().optional().allow('')
    }).required(),
    
    serviceLines: Joi.object({
        svc: Joi.string().required(),
        wasteType: Joi.string().required(),
        serviceCycle: Joi.string().optional().allow(''),
        tax: Joi.boolean().required(),
        tp: Joi.boolean().required(),
        municipalCode: Joi.string().optional().allow('')
    }).required(),
    
    routes: Joi.array().items(
        Joi.object({
            dayOfWeek: Joi.string().valid('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday').optional().allow(''),
            routeCode: Joi.string().optional().allow('')
        })
    ).optional(),
    createdby: Joi.string().required()
});
