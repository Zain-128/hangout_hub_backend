
import type { Response } from "express";
export const SuccessHandler = (res: Response, data: any, message: string, status:string = "200") => {
   
    const newStatus = status ? parseInt(status, 10) : 200;
   
    
    return res.status(newStatus).send({
        message,
        data,
        success: true,
    });
};