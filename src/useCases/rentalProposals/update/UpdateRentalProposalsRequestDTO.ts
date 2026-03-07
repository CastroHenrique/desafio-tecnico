import { CreateRentalProposalsRequestDTO } from "../create/CreateRentalProposalsRequestDTO";

export interface UpdateRentalProposalsRequestDTO extends CreateRentalProposalsRequestDTO {
    id: string;
}