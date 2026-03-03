import connection from "../config/dbConnection";
import { DatabaseError } from "../utils/CustomError";

export const insertCustomer = async (transactionId,customerId, customerConfig, customerBio, createdby) => {
    try {

        const { customerType, environment, MASlibrary, companyCode } = customerConfig;
        const { name, contact, address, city, state, zipcode, email, phone } = customerBio;

        const query = ` 
        INSERT INTO customers (transaction_id, customer_id, customer_type, customer_name, 
        contact_name, address_line1, city, state, zipcode, email, phone, environment, 
        mas_library, company_code, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        await connection.query(query,
            [transactionId, customerId, customerType, name, contact, address, city, state,
                zipcode, email, phone, environment, MASlibrary, companyCode, createdby]);
    } catch (error) {
        throw new DatabaseError(error.message, error);
    }
};

export const insertServiceAddress = async (transactionId, details) => {
    try {

        const { name, contact, address, city, state, zipcode, email, phone } = details;

        const query = `
        INSERT INTO service_addresses (transaction_id, service_name, contact_name, address_line1, 
        city, state, zipcode, email, phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        await connection.query(query, [transactionId, name, contact, address,
            city, state, zipcode, email, phone]);
    } catch (error) {
        throw new DatabaseError(error.message, error);
    }
};

export const insertBillingInfo = async (transactionId, details) => {
    try {

        const { billingCycle, startDate, contractType, contractDate, countryCode } = details;

        const query = `
        INSERT INTO billing_info (transaction_id, billing_cycle, start_date, 
        contract_type, contract_date, country_code) VALUES (?, ?, ?, ?, ?, ?) `;

        await connection.query(query, [transactionId, billingCycle, startDate,
            contractType, contractDate, countryCode]);

    } catch (error) {
        throw new DatabaseError(error.message, error);
    }
};

export const insertServiceLines = async (transactionId, details) => {
    try {

        const { svc, wasteType, serviceCycle, tax, tp, municipalCode } = details;

        const query = `
        INSERT INTO service_lines (transaction_id, svc, waste_type, service_cycle, 
        tax, tp, municipal_code) VALUES (?, ?, ?, ?, ?, ?, ?) `;

        await connection.query(query, [transactionId, svc, wasteType, serviceCycle,
            tax, tp, municipalCode]);

    } catch (error) {
        throw new DatabaseError(error.message, error);
    }
};

export const insertRoutes = async (transactionId, routes) => {
    try {

        const query = ` INSERT INTO routes (transaction_id, day_of_week, route_code) VALUES (?, ?, ?) `;

        for (const route of routes) {
            await connection.query(query, [transactionId, route.dayOfWeek, route.routeCode]);
        }

    } catch (error) {
        throw new DatabaseError(error.message, error);
    }
};
