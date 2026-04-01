import { prisma } from "../lib/prisma.js";
import type { User } from "../types/user.types.js";


export const createUser = async (userData: User) => {
    const user = await prisma.user.create({
        data: userData,
    });

    return user
};

export const getUserByEmail = async (email: string) => {
    const user = await prisma.user.findUnique({
        where: { email },
    });

    return user;
};

export const getUserById = async (id: string) => {
    const user = await prisma.user.findUnique({
        where: { id },
    });

    return user;
};

export const updateUserService = async (id: string, data: Partial<User>) => {
    const user = await prisma.user.update({
        where: { id },
        data,
    });

    return user;
};

export const createOtpService = async (email: string, otp: string) => {
    const otpData = await prisma.otp.create({
        data: {
            email,
            otp,
        },
    });

    return otpData;
};

export const deleteOtpService = async (email: string) => {
    const otpData = await prisma.otp.delete({
        where: { email },
    });

    return otpData;
};
export const getOtpBtEmail = async (email: string) => {
    const otpData = await prisma.otp.findUnique({
        where: { email },
    });

    return otpData;
};

export const deleteUserService = async (id: string) => {
    const user = await prisma.user.delete({
        where: { id },
    });

    return user;
};