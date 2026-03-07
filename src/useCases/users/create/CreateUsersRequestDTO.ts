import { AccessLevel } from "../../../entities/UserEntity";

export interface CreateUsersRequestDTO {
    name: string;
    username: string;
    password?: string;
    document: string;
    email?: string;
    accessLevel: AccessLevel;
    status?: boolean;
}