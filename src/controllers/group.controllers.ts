import type { NextFunction  , Response , Request} from "express";
import { AsyncHandler } from "../middlewares/AsyncHandler.js";
import type { GroupType } from "../types/group.types.js";
import { addUserToGroupService, createGroupService, deleteGroupService, getGroupService, removeUserFromGroupService } from "../services/group.services.js";
import { SuccessHandler } from "../middlewares/SuccessHandler.js";

export const createGroupController = AsyncHandler(async (req: Request, res: Response , next: NextFunction) => {
    const { name, description, category, image  , groupAdmins , groupMembers} : GroupType = req.body as GroupType;
    const data = {
        name ,
        description,
        category,
        image,
        admins:{connect : groupAdmins.map((admin) => ({id: admin.id}))},
        members:{connect : groupMembers.map((member) => ({id: member.id}))},
    }
    const group = await createGroupService(data as unknown as GroupType);
    return SuccessHandler(res, { group }, "Group created successfully", "201");
});

export const getGroupController = AsyncHandler(async (req: Request, res: Response , next: NextFunction) => {
    const { id } = req.params;
    const group = await getGroupService (id as string);
    if(!group){
        return next({
            statusCode: 400,
            message: "Group not found",
            stack: new Error().stack,
            status: "400",
        });
    }
    return SuccessHandler(res, { group }, "Group fetched successfully", "200");
});

export const deleteGroupController = AsyncHandler(async (req: Request, res: Response , next: NextFunction) => {
    const { id } = req.params;
    const group = await deleteGroupService(id as string);
    if(!group){
        return next({
            statusCode: 400,
            message: "Group not found",
            stack: new Error().stack,
            status: "400",
        });
    }
    return SuccessHandler(res, { group }, "Group deleted successfully", "200");
});

export const addUserToGroupController = AsyncHandler(async (req: Request, res: Response , next: NextFunction) => {
    const { id } = req.params;
    const { userId } = req.body;
    const group = await addUserToGroupService(id as string, userId as string);
    if(!group){
        return next({
            statusCode: 400,
            message: "Failed to add user to group",
            stack: new Error().stack,
            status: "400",
        });
    }
    return SuccessHandler(res, { group }, "User added to group successfully", "200");
});

export const removeUserFromGroupController = AsyncHandler(async (req: Request, res: Response , next: NextFunction) => {
    const { id } = req.params;
    const { userId } = req.body;
    const group = await removeUserFromGroupService(id as string, userId as string);
    if(!group){
        return next({
            statusCode: 400,
            message: "Failed to remove user from group",
            stack: new Error().stack,
            status: "400",
        });
    }
    return SuccessHandler(res, { group }, "User removed from group successfully", "200");
});