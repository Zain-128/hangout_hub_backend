import type { NextFunction , Response , Request } from "express";
import { AsyncHandler } from "../middlewares/AsyncHandler.js";
import { SuccessHandler } from "../middlewares/SuccessHandler.js";
import { createOtpService, createUser as createUserService, deleteOtpService, deleteUserService, getOtpBtEmail, getUserByEmail, getUserById, updateUserService } from "../services/user.services.js";
import type { LoginUser, User } from "../types/user.types.js";
import { comparePassword, generateOtp, generateToken, hashPassword } from "../utils/helper.js";
import type { userData } from "../types/auth.types.js";
export const createUserController = AsyncHandler(async (req: Request, res: Response , next: NextFunction) => {

    if(!req.body){
        return next({
            statusCode: 400,
            message: "User data is required",
            stack: new Error().stack,
            status: "400",
        });
    }

    const body = req.body as User;
    const { email, password, firstName, lastName, phone } = body;

    const checkUserExists = await getUserByEmail(email);
    if(checkUserExists){
        return next({
            statusCode: 400,
            message: "User already exists",
            stack: new Error().stack,
            status: "400",
        });
    }

    const hashedPassword = await hashPassword(password);
    const user = await createUserService({
        email,
        password:hashedPassword,
        firstName,
        lastName,
        phone,
    });

 
    const otp = await generateOtp(user.id);
    const otpData = await createOtpService(email, String(otp));

    return SuccessHandler(res, { user }, "User created successfully", "201");
    
});



export const loginUserController = AsyncHandler(async (req: Request, res: Response , next: NextFunction) => {
    if(!req.body){
        return next({
            statusCode: 400,
            message: "User data is required",
            stack: new Error().stack,
            status: "400",
        });
    }
    const body = req.body as LoginUser;
    const { email, password} = body;

    const user = await getUserByEmail(email);
    if(!user){
        return next({
            statusCode: 400,
            message: "User not found",
            stack: new Error().stack,
            status: "400",
        });
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if(!isPasswordValid){
        return next({
            statusCode: 400,
            message: "Invalid password",
            stack: new Error().stack,
            status: "400",
        });
    }

    const token = await generateToken({
        id : user.id,
        email : user.email,
        firstName : user.firstName,
        lastName : user.lastName,
        phone : user.phone,
    });
    return SuccessHandler(res, { user, token }, "User logged in successfully", "200");
});



export const getUserController = AsyncHandler(async (req: Request, res: Response , next: NextFunction) => {

    const user = (req as Request & {user : userData}).user as userData;
   
    const userData = await getUserById(user.id);
    if(!userData){
        return next({
            statusCode: 400,
            message: "User not found",
            stack: new Error().stack,
            status: "400",
        });
    }
    return SuccessHandler(res, userData, "User fetched successfully", "200");
});


export const forgetPasswordController = AsyncHandler(async (req: Request, res: Response , next: NextFunction) => {
    const { email } = req.body as { email: string };
    const user = await getUserByEmail(email);
    if(!user){
        return next({
            statusCode: 400,
            message: "User not found",
            stack: new Error().stack,
            status: "400",
        });
    }

    const otpExists = await getOtpBtEmail(email);
    if(otpExists){
       await deleteOtpService(email);
    }
    const otp = await generateOtp(user.id);
    const otpData = await createOtpService(email, String(otp));
    if(!otpData){
        return next({
            statusCode: 400,
            message: "Failed to create OTP",
            stack: new Error().stack,
            status: "400",
        });
    }


    // Send Email to the user
  
    return SuccessHandler(res, {}, "Password reset email sent successfully", "200");
});

export const verifyOtpController = AsyncHandler(async (req: Request, res: Response , next: NextFunction) => {
    const { email, otp , type } = req.body as { email: string, otp: string , type: "reset" | "register" };
    const user = await getUserByEmail(email);
    if(!user){
        return next({
            statusCode: 400,
            message: "User not found",
            stack: new Error().stack,
            status: "400",
        });
    }

    const otpData = await getOtpBtEmail(email);
    if(!otpData){
        return next({
            statusCode: 400,
            message: "OTP not found",
            stack: new Error().stack,
            status: "400",
        });
    }

    if(otpData.otp !== otp){
        return next({
            statusCode: 400,
            message: "Invalid OTP",
            stack: new Error().stack,
            status: "400",
        });
    }

    if(type === "register"){
        const updatedUser = await updateUserService(user.id, { isVerified: true });
        if(!updatedUser){
            return next({
                statusCode: 400,
                message: "Failed to verify user",
                stack: new Error().stack,
                status: "400",
            });
        }
    }

    await deleteOtpService(email);
    return SuccessHandler(res, {
        token : type === "register" ? await generateToken({
            id : user.id,
            email : user.email,
            firstName : user.firstName,
            lastName : user.lastName,
            phone : user.phone,
        }) : null,
    }, "OTP verified successfully", "200");
});


export const resendOtpController = AsyncHandler(async (req: Request, res: Response , next: NextFunction) => {
    const { email } = req.body as { email: string };
    const user = await getUserByEmail(email);
    if(!user){
        return next({
            statusCode: 400,
            message: "User not found",
            stack: new Error().stack,
            status: "400",
        });
    }

    const otpExists = await getOtpBtEmail(email);
    if(otpExists){
       await deleteOtpService(email);
    }

    const otp = await generateOtp(user.id);
    const otpData = await createOtpService(email, String(otp));
    if(!otpData){
        return next({
            statusCode: 400,
            message: "Failed to create OTP",
            stack: new Error().stack,
            status: "400",
        });
    }

    return SuccessHandler(res, {}, "OTP resent successfully", "200");
});


export const resetPasswordController = AsyncHandler(async (req: Request, res: Response , next: NextFunction) => {
    const { email, password } = req.body as { email: string, password: string };
    const user = await getUserByEmail(email);
    if(!user){
        return next({
            statusCode: 400,
            message: "User not found",
            stack: new Error().stack,
            status: "400",
        });
    }


    const hashedPassword = await hashPassword(password);

    const updatedUser = await updateUserService(user.id, { password: hashedPassword });
    if(!updatedUser){
        return next({
            statusCode: 400,
            message: "Failed to reset password",
            stack: new Error().stack,
            status: "400",
        });
    }

    return SuccessHandler(res, {}, "Password reset successfully", "200");
});

export const changePasswordController = AsyncHandler(async (req: Request, res: Response , next: NextFunction) => {
    
    const { oldPassword, newPassword } = req.body as { oldPassword: string, newPassword: string };
   
    const user = (req as any).user as { id: string , email: string , firstName: string , lastName: string , phone: string  };
    const currentUser = await getUserById(user.id);
    const isOldPasswordValid = await comparePassword(oldPassword, (currentUser as User).password);
    if(!isOldPasswordValid){
        return next({
            statusCode: 400,
            message: "Invalid old password",
            stack: new Error().stack,
            status: "400",
        });
    }
    const hashedPassword = await hashPassword(newPassword);
    const updatedUser = await updateUserService(user.id, { password: hashedPassword });
    if(!updatedUser){
        return next({
            statusCode: 400,
            message: "Failed to change password",
            stack: new Error().stack,
            status: "400",
        });
    }
    return SuccessHandler(res, {}, "Password changed successfully", "200");
});

export const updateUserController = AsyncHandler(async (req: Request, res: Response , next: NextFunction) => {

   const profilePicture = req.file?.filename ? `${process.env.BASE_URL}/${req.file.filename}` : null;
    


    const { firstName, lastName, phone, bio, eventsOfInterest } = req.body as { firstName: string, lastName: string, phone: string, bio: string, eventsOfInterest: string };
    const user = (req as any).user as { id: string , email: string , firstName: string , lastName: string , phone: string };
    const updatedUser = await updateUserService(user.id, { firstName, lastName, phone , profilePicture, bio, eventsOfInterest});
    if(!updatedUser){
        return next({
            statusCode: 400,
            message: "Failed to update user",
            stack: new Error().stack,
            status: "400",
        });
    }
    return SuccessHandler(res, updatedUser, "User updated successfully", "200");
});


export const deleteUserController = AsyncHandler(async (req: Request, res: Response , next: NextFunction) => {



   

    const user = (req as any).user as { id: string , email: string , firstName: string , lastName: string , phone: string };
    const deletedUser = await deleteUserService(user.id);
    if(!deletedUser){
        return next({
            statusCode: 400,
            message: "Failed to delete user",
            stack: new Error().stack,
            status: "400",
        });
    }
    return SuccessHandler(res, {}, "User deleted successfully", "200");
});