import { RentalProposalsStatus } from "./RentalProposals";

export class ProposalStatusHistoriesEntity {
    id!: string;
    rentalProposalId!: string;
    oldStatus?: RentalProposalsStatus;
    newStatus?: RentalProposalsStatus;
    deletedAt?: Date;
    deletedBy?: string;
    readonly createdAt?: Date;
    readonly updatedAt?: Date;

    constructor(props: ProposalStatusHistoriesEntity) {
        Object.assign(this, props);
    }
}