import type { NextFunction , Request , Response } from "express";
import { AsyncHandler } from "../middlewares/AsyncHandler.js";
import { SuccessHandler } from "../middlewares/SuccessHandler.js";
import { acceptOrRejectJoinRequestService, createJoinRequestService, deleteJoinRequestService, getAllJoinRequestsForAGroupService } from "../services/joinRequest.services.js";
import type { JoinRequestType } from "../types/joinRequest.types.js";

export const createJoinRequestController = AsyncHandler(async (req: Request, res: Response , next: NextFunction) => {
    const { userId, groupId , status } : JoinRequestType = req.body as unknown as JoinRequestType;

    const joinRequest = await createJoinRequestService(userId as string, groupId as string , status as string);
    return SuccessHandler(res, { joinRequest }, "Join request created successfully", "201");
});


export const getAllJoinRequestsForAGroupController = AsyncHandler(async (req: Request, res: Response , next: NextFunction) => {
    const { id } = req.params;
    if(!id){
        return next({
            statusCode: 400,
            message: "Group ID is required",
            stack: new Error().stack,
            status: "400",
        });
    }
    const joinRequests = await getAllJoinRequestsForAGroupService(id as string);
    return SuccessHandler(res, { joinRequests }, "All join requests fetched successfully", "200");
});

export const acceptOrRejectJoinRequestController = AsyncHandler(async (req: Request, res: Response , next: NextFunction) => {
    const { id } = req.params;
    const { status } = req.body;
    const joinRequest = await acceptOrRejectJoinRequestService(id as string, status as string);
    if(!joinRequest){
        return next({
            statusCode: 400,
            message: "Failed to accept or reject join request",
            stack: new Error().stack,
            status: "400",
        });
    }
    await deleteJoinRequestService(id as string);
    return SuccessHandler(res, { joinRequest }, "Join request accepted or rejected successfully", "200");
});