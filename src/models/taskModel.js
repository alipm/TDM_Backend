import connection from "../config/dbConnection";

export const getUserByEmail = async (email) => {
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return users[0]; // Return a single user
};