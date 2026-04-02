import { prisma } from "../lib/prisma.js";

export const createJoinRequestService = async (userId: string, groupId: string, status: string) => {
    const joinRequest = await prisma.joinRequest.create({
        data: { userId, groupId, status },
    });
    return joinRequest;
};

export const getAllJoinRequestsForAGroupService = async (groupId: string) => {
    const joinRequests = await prisma.joinRequest.findMany({
        where: { groupId },
        include: {
            user: true,
            group: true,
        },
    });
    return joinRequests;
};
export const acceptOrRejectJoinRequestService = async (id: string, status: string) => {
    const joinRequest = await prisma.joinRequest.update({
        where: { id },
        data: { status },
    });
    return joinRequest;
};

export const deleteJoinRequestService = async (id: string) => {
    const joinRequest = await prisma.joinRequest.delete({
        where: { id },
    });
    return joinRequest;
};