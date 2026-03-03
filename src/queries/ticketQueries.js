import connection from "../config/dbConnection";
import { DatabaseError } from "../utils/CustomError";

export const insertTicket = async (Customer_ID, Environment, Category, Sub_Category,
    Waste_Type, formattedDispatchDate, Swappable_Flag, Transaction_ID, createdby) => {
    try {

        const query = ` INSERT INTO tickets (mas_customer_id, environment, sub_category, 
        dispatch_date, ESB_transaction_id, waste_type, category, swappable_flag, created_by) VALUES 
        (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        await connection.query(query,
            [Customer_ID, Environment, Sub_Category, formattedDispatchDate,
                Transaction_ID, Waste_Type, Category, Swappable_Flag, createdby]);
    } catch (error) {
        throw new DatabaseError(error.message, error);
    }
};

export const insertbulkTicket = async (values) => {
    try {

        const query = ` INSERT INTO tickets (mas_customer_id, environment, sub_category, 
        dispatch_date, ESB_transaction_id, waste_type, category, swappable_flag) VALUES 
        ?`;

        await connection.query(query,
            [values]);
    } catch (error) {
        throw new DatabaseError(error.message, error);
    }
};

