import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ValidationError, NotFoundError } from '../utils/CustomError';
import { MESSAGES } from "../config/messages";
import { generateNumericId } from '../utils/HelperClass';

import { checkIfUserExists, createUserDB, fetchUserDB, updateUserDB, deleteUserFromDB } from '../queries/authQueries';

import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '24h'; // Token validity duration

export const loginUser = async (user, password) => {

  const data = await checkIfUserExists(user);
  if (!data) throw new NotFoundError(MESSAGES.USER_NOT_FOUND);
  if (data.status !== 'Active') throw new ValidationError(MESSAGES.USER_INACTIVE);

  const isPasswordValid = await bcrypt.compare(password, data.password_hash);
  if (!isPasswordValid) throw new ValidationError(MESSAGES.INVALID_CREDENTIALS);

  // Generate JWT
  const token = jwt.sign({ id: data.user_id, email: data.email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  // Return only essential user details, e.g., exclude password
  return { id: data.user_id, username: data.username, email: data.email, role: data.role, token };
};

export const createUsers = async ({ username, email, password, status, last_modified_by }) => {
  const userID = generateNumericId(10);

  // Encrypt the password
  const saltRounds = 10; // Number of salt rounds (higher = more secure, slower)
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const role = 'User';
  const response = await createUserDB(userID, username, email, hashedPassword, role,
    status, last_modified_by);
  return { userID };
};

export const fetchUserFromDB = async () => {
  const role = 'User';
  
  const response = await fetchUserDB(role);
  return { response };
};

 export const updateUsers = async ({ username, email, status, last_modified_by, user_id }) => {

  const data = await updateUserDB(username, email, status, last_modified_by, user_id);
  if (!data.affectedRows > 0) throw new NotFoundError(MESSAGES.USER_NOT_FOUND);
  return { data };
 };

export const deleteUsers = async ( user_id ) => {

  const data = await deleteUserFromDB(user_id);
  if (!data.affectedRows > 0) throw new NotFoundError(MESSAGES.USER_NOT_FOUND);
  return { data };
};