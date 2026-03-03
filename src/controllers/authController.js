import asyncHandler from "../middlewares/asyncHandler";
import { ValidationError } from "../utils/CustomError";
import { MESSAGES } from "../config/messages";
import { loginUser, createUsers, fetchUserFromDB, updateUsers, deleteUsers } from "../services/authService";

export const loginUserController = asyncHandler(async (req, res, next) => {
    const { user, password } = req.body;

    if (!user || !password) {
        throw new ValidationError(MESSAGES.EMAIL_AND_PASS_REQUIRED);
    }
    const data = await loginUser(user, password);
    res.status(200).json({ message: MESSAGES.LOGIN_SUCCESSFUL, data });
});

export const createUser = asyncHandler(async (req, res, next) => {
    const payload = req.body;

    const response = await createUsers(payload);
    res.status(200).json({ message: MESSAGES.USER_CREATED, data: response });
});

export const fetchUser = asyncHandler(async (req, res, next) => {
    
    const response = await fetchUserFromDB();
    res.status(200).json({ message: MESSAGES.RETRIEVED_DATA, data: response });
});

export const updateUser = asyncHandler(async (req, res, next) => {
    const payload = req.body;

    const response = await updateUsers(payload);
    res.status(200).json({ message: MESSAGES.USER_UPDATED });
});

export const deleteUser = asyncHandler(async (req, res, next) => {
    const { user_id } = req.body;

    if (!user_id) {
        throw new ValidationError(MESSAGES.INCORRECT_DETAILS);
    }
    const response = await deleteUsers(user_id);
    res.status(200).json({ message: MESSAGES.USER_DELETE });
});