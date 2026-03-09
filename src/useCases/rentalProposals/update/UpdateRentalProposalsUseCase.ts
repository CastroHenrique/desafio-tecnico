import { PropertiesStatus } from "../../../entities/PropertiesEntity";
import { RentalProposalsStatus, VALID_TRANSITIONS } from "../../../entities/RentalProposals";
import knex from "../../../knex";
import { IPropertiesRepository } from "../../../repositories/properties/IPropertiesRepository";
import { IRentalProposalsRepository } from "../../../repositories/rentalProposals/IRentalProposalsRepository";
import { UpdateRentalProposalsRequestDTO } from "./UpdateRentalProposalsRequestDTO";


export class UpdateRentalProposalsUseCase {

    
    constructor(
        private rentalProposalsRepository: IRentalProposalsRepository,
        private propertiesRepository: IPropertiesRepository
    ) {}

    async execute(dataProposal: UpdateRentalProposalsRequestDTO) {
        const trx = await knex.transaction();
        
        //check if data proposal is valid
        if(!dataProposal.id || !dataProposal.status) {
            trx.rollback();
            throw new Error("ID e status são obrigatórios");
        }

        //check if proposal exists

        const existingProposal = await (async () => {
            try {
                return await this.rentalProposalsRepository.findById(dataProposal.id);
            } catch (err: any) {
                trx.rollback();
                throw new Error("Erro ao buscar proposta de aluguel no banco de dados");
            }
        })();

        if(!existingProposal) {
            trx.rollback();
            throw new Error("Proposta de aluguel não encontrada");
        }

        const property = await (async () => {
            try {
                return await this.propertiesRepository.findById(existingProposal.propertyId);
            } catch (err: any) {
                trx.rollback();
                throw new Error("Erro ao buscar imóvel no banco de dados");
            }
        })();

        if(!property) {
            trx.rollback();
            throw new Error("Imóvel não encontrado");
        }
        
        const currentStatus = existingProposal.status;
        const nextStatus = dataProposal.status;

        const isValidTransition = VALID_TRANSITIONS[currentStatus];

        if(!isValidTransition.includes(nextStatus)) {
            trx.rollback();
            throw new Error(`Transição inválida de ${currentStatus} para ${nextStatus}`)
        };

        if(nextStatus === RentalProposalsStatus.ATIVO) {
            await this.propertiesRepository.save({
                ...property, status: PropertiesStatus.ALUGADO,
            }, trx);
        } else if (nextStatus === RentalProposalsStatus.CANCELADA || nextStatus === RentalProposalsStatus.REPROVADA) {
            await this.propertiesRepository.save({
                ...property, status: PropertiesStatus.DISPONIVEL,
            }, trx);
        }

        const updatedRentalProposal = await (async () => {
            try {
                return await this.rentalProposalsRepository.save({
                    ...existingProposal,
                    status: nextStatus,
                }, trx);
            } catch (err: any) {
                trx.rollback();
                throw new Error("Erro ao atualizar status da proposta de aluguel no banco de dados");
            }
        })();


        const addedProposalStatusHistory = await (async () => {
            try {
                return await this.rentalProposalsRepository.addProposalStatusHistory(existingProposal.id, currentStatus, nextStatus, trx);
            } catch (err: any) {
                trx.rollback();
                throw new Error("Erro ao adicionar histórico de status da proposta de aluguel");
            }
        })();   

        if(!addedProposalStatusHistory) {
            trx.rollback();
            throw new Error("Erro ao adicionar histórico de status da proposta de aluguel");
        }

        const { updatedAt, createdAt, deletedAt,deletedBy, ...rentalProposalToReturn } = updatedRentalProposal;

        await trx.commit();

        return rentalProposalToReturn;
    }
};