import connection from "../config/dbConnection";
import { DatabaseError } from "../utils/CustomError";

export const checkIfUserExists = async (user) => {
    try {
        const [users] = await connection.query('SELECT * FROM users WHERE (email = ? OR username = ?)', [user, user]);
        return users.length > 0 ? users[0] : null; // Return the first user or null
    } catch (error) {
        throw new DatabaseError(error.message, error);
    }
};

export const createUserDB = async (userID, username, email, hashedPassword, role,
    status, last_modified_by) => {
    try {
        const query = ` INSERT INTO users (user_id, username, email, password_hash, 
        role, status, last_modified_by) VALUES 
        (?, ?, ?, ?, ?, ?, ?)`;

        await connection.query(query,
            [userID, username, email, hashedPassword, role, status, last_modified_by]);
        return userID;
    } catch (error) {
        throw new DatabaseError(error.message, error);
    }
};

export const fetchUserDB = async (role) => {
    try {
        const query = `SELECT * FROM users where role = ?`;

        const [users] = await connection.query(query,
            [role]);
        return users; // Return the first user or null
    } catch (error) {
        throw new DatabaseError(error.message, error);
    }
};

export const updateUserDB = async (username, email, status, last_modified_by, user_id) => {
    try {
        const query = `UPDATE users SET username = ?, email = ?, status = ?, 
        last_modified_by = ? WHERE user_id = ?`;

        const [users] = await connection.query(query,
            [username, email, status, last_modified_by, user_id]);
        return users;
    } catch (error) {
        throw new DatabaseError(error.message, error);
    }
};

export const deleteUserFromDB = async (user_id) => {
    try {
        const query = `DELETE FROM WM.users WHERE user_id = ?`;
        const [users] = await connection.query(query,
            [user_id]);
        return users;
    } catch (error) {
        throw new DatabaseError(error.message, error);
    }
};

