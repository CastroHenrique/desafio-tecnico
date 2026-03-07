import { CreateUsersRequestDTO } from "../create/CreateUsersRequestDTO";

export interface UpdateUsersRequestDTO extends CreateUsersRequestDTO {
    id: string;
};