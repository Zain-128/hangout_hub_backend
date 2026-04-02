type UserType = {
    id: string;
};

export type GroupType = {
    name: string;
    description: string;
    category: string;
    image: string;
    groupAdmins: UserType[];
    groupMembers: UserType[];
};

