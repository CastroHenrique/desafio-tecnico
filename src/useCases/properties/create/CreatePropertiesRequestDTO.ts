import { PropertiesStatus } from "../../../entities/PropertiesEntity";

export interface CreatePropertiesRequestDTO {
    price: number;
    reference?: number;
    addressZipCode: string;
    addressStreet: string;
    addressNumber: string;
    addressComplement?: string;
    addressNeighborhood: string;
    addressCity: string;
    addressState: string;
    status?: PropertiesStatus;
}