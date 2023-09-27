import { Role } from "./role";

export interface User {
    id: number;
    kubsuUserId: number;
    username: string;
    fullName: string;
    roles: Role[];
    token?: string;
}