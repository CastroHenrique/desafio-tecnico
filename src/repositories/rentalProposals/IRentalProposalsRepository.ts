import { Knex } from "knex";
import { RentalProposalsEntity, RentalProposalsStatus } from "../../entities/RentalProposals";
import { ProposalStatusHistoriesEntity } from "../../entities/ProposalStatusHistories";


export interface IRentalProposalsRepository {
    findAll(): Promise<RentalProposalsEntity[] | undefined>;
    findById(id: string): Promise<RentalProposalsEntity | undefined>;
    findByPropertyId(propertyId: string): Promise<RentalProposalsEntity | undefined>;
    findByUserId(userId: string): Promise<RentalProposalsEntity | undefined>;
    findByPropertyIdAndUserId(propertyId: string, userId: string): Promise<RentalProposalsEntity | undefined>;
    addProposalStatusHistory(rentalProposalId: string, oldStatus: RentalProposalsStatus, newStatus: RentalProposalsStatus, trx?: Knex.Transaction): Promise<boolean>;
    findProposalStatusHistoryByRentalProposalId(rentalProposalId: string): Promise<ProposalStatusHistoriesEntity[] | undefined>;
    save(rentalProposal: RentalProposalsEntity, trx?: Knex.Transaction): Promise<RentalProposalsEntity>;
    remove(id: string, userId: string, trx?: Knex.Transaction): Promise<boolean>;
}