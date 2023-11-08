import { Role } from "./IRole";

export interface User {
    id: number;
    kubsuUserId: number;
    username: string;
    fullName: string;
    roles: Role[];
    token?: string;
}