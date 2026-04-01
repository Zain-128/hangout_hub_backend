
export type  userData= {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
};
export type DecodedToken = {
    userData: userData,
    iat: number;
    exp: number;
};