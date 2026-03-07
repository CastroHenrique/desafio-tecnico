import { Knex } from "knex";
import { RentalProposalsEntity, RentalProposalsStatus } from "../../entities/RentalProposals";
import { IRentalProposalsRepository } from "./IRentalProposalsRepository";
import knex from "../../knex";
import { v4 as uuidv4 } from "uuid";
import { ProposalStatusHistoriesEntity } from "../../entities/ProposalStatusHistories";


export class MySqlRentalProposalsRepository implements IRentalProposalsRepository {
    public async findAll(): Promise<RentalProposalsEntity[] | undefined> {
        const rentalProposals: RentalProposalsEntity[] = await knex<RentalProposalsEntity>("rental_proposals").whereNull("deletedAt").orderBy("createdAt", "desc");

        if(!rentalProposals) return undefined;

        return rentalProposals;
    }
    public async findById(id: string, trx?: Knex.Transaction): Promise<RentalProposalsEntity | undefined> {
        const bd = trx ? trx : knex;
        const rentalProposal = await bd<RentalProposalsEntity>("rental_proposals")
        .where("id", id)
        .whereNull("deletedAt")
        .first();

        return rentalProposal;
    }
    public async findByPropertyId(propertyId: string): Promise<RentalProposalsEntity | undefined> {
        const rentalProposal = await knex<RentalProposalsEntity>("rental_proposals")
            .where("propertyId", propertyId)
            .whereNull("deletedAt")
            .first();

        return rentalProposal;
    }
    public async findByUserId(userId: string): Promise<RentalProposalsEntity | undefined> {
        const rentalProposal = await knex<RentalProposalsEntity>("rental_proposals")
            .where("userId", userId)
            .whereNull("deletedAt")
            .first();

        return rentalProposal;
    }
    public async findByPropertyIdAndUserId(propertyId: string, userId: string): Promise<RentalProposalsEntity | undefined> {
        const rentalProposal = await knex<RentalProposalsEntity>("rental_proposals")
            .where("propertyId", propertyId)
            .where("userId", userId)
            .whereNull("deletedAt")
            .first();

        return rentalProposal;
    }
    public async addProposalStatusHistory(rentalProposalId: string, oldStatus: RentalProposalsStatus, newStatus: RentalProposalsStatus, trx?: Knex.Transaction): Promise<boolean> {
        const bd = trx ? trx : knex;
        
        const count = await bd<ProposalStatusHistoriesEntity>("proposal_status_histories").insert({
            id:  uuidv4(),
            rentalProposalId: rentalProposalId,
            oldStatus: oldStatus || "",
            newStatus: newStatus,
        });
        
        return count.length > 0;
    }
    public async findProposalStatusHistoryByRentalProposalId(rentalProposalId: string): Promise<ProposalStatusHistoriesEntity[] | undefined> {
        const proposalStatusHistories: ProposalStatusHistoriesEntity[] = await knex<ProposalStatusHistoriesEntity>("proposal_status_histories").where("rentalProposalId", rentalProposalId).whereNull("deletedAt").orderBy("createdAt", "desc");

        return proposalStatusHistories;
    }
    public async save(rentalProposal: RentalProposalsEntity, trx?: Knex.Transaction): Promise<RentalProposalsEntity> {
        const bd = trx ? trx : knex;
        const oldRentalProposal = await this.findById(rentalProposal.id, trx);

        if(oldRentalProposal){
            await bd<RentalProposalsEntity>("rental_proposals").where("id", rentalProposal.id).update({
                propertyId: rentalProposal.propertyId,
                userId: rentalProposal.userId,
                status: rentalProposal.status,
            });
        } else {
            if(!rentalProposal.id || rentalProposal.id === "") rentalProposal.id = uuidv4();
            await bd<RentalProposalsEntity>("rental_proposals").insert({
                id: rentalProposal.id,
                propertyId: rentalProposal.propertyId,
                userId: rentalProposal.userId,
                status: rentalProposal.status || RentalProposalsStatus.NOVA,
            });
        }

        return rentalProposal;
    }

    public async remove(id: string, userId: string, trx?: Knex.Transaction): Promise<boolean> {
        const bd = trx ? trx : knex;

        const count = await bd<RentalProposalsEntity>("rental_proposals").where("id", id).update({ 
            deletedAt: knex.fn.now(), 
            deletedBy: userId 
        });

        return count > 0;
    }
    
}