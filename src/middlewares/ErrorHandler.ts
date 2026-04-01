import type { NextFunction  , Response , Request} from "express";
import type { ErrorType } from "../types/error.types.js";

export const ErrorHandler = (err: Error | ErrorType, req: Request, res: Response, next: NextFunction) => {

   
    res.status((err as ErrorType).statusCode || 500).send({
        message: (err as ErrorType).message,
        stack: (err as ErrorType).stack,
        data:null
        ,
        success: false,
    });
};

export default ErrorHandler;