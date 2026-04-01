import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { User } from "../types/user.types.js";

export const comparePassword = async (password: string, hashedPassword: string) => {
    return await bcrypt.compare(password, hashedPassword);
};

export const hashPassword = async (password: string) => {
    return await bcrypt.hash(password, 10);
};

export const verifyToken = async (token: string) => {
    return await jwt.verify(token, process.env.JWT_SECRET as string);
};

export const generateToken = async (userData: Omit<User, "password"> & { id: string }) => {
    return await jwt.sign({ userData }, process.env.JWT_SECRET as string, { expiresIn: "1h" });
};

export const generateOtp = async (userId: string) => {
    // const otp = Math.floor(100000 + Math.random() * 900000);
    // return otp;
    return "1234"
};