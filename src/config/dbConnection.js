import { createPool } from 'mysql2/promise';
import dotenv from "dotenv"; // To load environment variables

dotenv.config();

const connection = createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

connection.on('connection', () => console.log('MySQL pool connected'));
connection.on('error', (err) => console.error('MySQL pool error:', err));

export default connection;