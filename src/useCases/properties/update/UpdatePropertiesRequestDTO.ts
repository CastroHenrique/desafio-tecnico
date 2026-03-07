import { CreatePropertiesRequestDTO } from "../create/CreatePropertiesRequestDTO";

export interface UpdatePropertiesRequestDTO extends CreatePropertiesRequestDTO {
    id: string;
}