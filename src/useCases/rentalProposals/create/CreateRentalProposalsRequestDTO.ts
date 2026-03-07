import { RentalProposalsStatus } from "../../../entities/RentalProposals";

export interface CreateRentalProposalsRequestDTO {
    propertyId: string;
    userId: string;
    status?: RentalProposalsStatus;
}