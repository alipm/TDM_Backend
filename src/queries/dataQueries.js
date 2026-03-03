import connection from "../config/dbConnection";
import { DatabaseError } from "../utils/CustomError";

export const getTicketData = async (StartDate, EndDate, UserId, Role) => {
    try {

        let query = `SELECT * FROM tickets WHERE created_at BETWEEN ? AND ?`;
        const queryParams = [`${StartDate} 00:00:00`, `${EndDate} 23:59:59`];

        // Add additional condition based on role
        if (Role.toLowerCase() === 'user') {
            query += ` AND created_by = ?`;
            queryParams.push(UserId); // Add the UserId to the query parameters
        }

        // Execute the query
        const [results] = await connection.query(query, queryParams);
        // Remove 'ticket_id' from the results
        const filteredResults = results.map(({ ticket_id, ...rest }) => rest);
        return filteredResults;
        
    } catch (error) {
        throw new DatabaseError(error.message, error);
    }
};

export const getCustomerData = async (StartDate, EndDate, UserId, Role) => {
    try {

        // let query = `SELECT c.*, sa.*, bi.*, sl.*, r.* FROM customers c
        // LEFT JOIN service_addresses sa ON c.transaction_id = sa.transaction_id
        // LEFT JOIN billing_info bi ON c.transaction_id = bi.transaction_id
        // LEFT JOIN service_lines sl ON c.transaction_id = sl.transaction_id
        // LEFT JOIN routes r ON c.transaction_id = r.transaction_id
        // WHERE c.created_at BETWEEN ? AND ?`;

        let query = `SELECT * FROM customers WHERE created_at BETWEEN ? AND ?`;
        
        const queryParams = [`${StartDate} 00:00:00`, `${EndDate} 23:59:59`];

        // Add additional condition based on role
        if (Role.toLowerCase() === 'user') {
            query += ` AND created_by = ?`;
            queryParams.push(UserId); // Add the UserId to the query parameters
        }

        // Execute the query
        const [results] = await connection.query(query, queryParams);

        // Remove 'customer_id' from the results
        const filteredResults = results.map(({ customer_id, ...rest }) => rest);
        return filteredResults;
    } catch (error) {
        throw new DatabaseError(error.message, error);
    }
};
