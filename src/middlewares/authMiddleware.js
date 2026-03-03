import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../utils/CustomError';
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const authenticateJWT = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    
    if (!token) throw new UnauthorizedError('No token provided');

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Attach user info to request object
        next(); // Proceed to the next middleware/route
    } catch (error) {
        throw new UnauthorizedError('Invalid or expired token');
    }
};

export const verifyAdmin = (req, res, next) => {
    const { role } = req.user; // Assuming `req.user` is populated by authentication middleware
    if (role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Admins only' });
    }
    next();
  };
