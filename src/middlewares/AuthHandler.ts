import type { NextFunction, Request } from "express";
import { AsyncHandler } from "./AsyncHandler.js";
import { verifyToken } from "../utils/helper.js";
import type { DecodedToken } from "../types/auth.types.js";


export const AuthHandler = AsyncHandler(async (req: Request, res: Response , next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];
    if(!token){
        return next({
            statusCode: 401,
            message: "Unauthorized",
            stack: new Error().stack,
            status: "401",
        });
    }
    const decoded = await verifyToken(token);
    if(!decoded){
        return next({
            statusCode: 401,
            message: "Unauthorized",
            stack: new Error().stack,
            status: "401",
        });
    }



    (req as Request & { user: DecodedToken["userData"] }).user = (decoded as DecodedToken).userData;
    return next();
});