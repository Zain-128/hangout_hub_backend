export type User = {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
    isVerified?: boolean;
    profilePicture?: string | null;
    bio?: string;
    eventsOfInterest?: string;
};

export type LoginUser = {
    email: string;
    password: string;
};