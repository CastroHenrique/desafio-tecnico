import { PropertiesStatus } from "../../../entities/PropertiesEntity";
import { RentalProposalsEntity, RentalProposalsStatus } from "../../../entities/RentalProposals";
import knex from "../../../knex";
import { IPropertiesRepository } from "../../../repositories/properties/IPropertiesRepository";
import { IRentalProposalsRepository } from "../../../repositories/rentalProposals/IRentalProposalsRepository";
import { CreateRentalProposalsRequestDTO } from "./CreateRentalProposalsRequestDTO";
import { v4 as uuidv4 } from "uuid";

export class CreateRentalProposalsUseCase {
    
    constructor(
        private rentalProposalsRepository: IRentalProposalsRepository,
        private propertiesRepository: IPropertiesRepository
    ) {}

    async execute(dataProposal: CreateRentalProposalsRequestDTO) {
        const trx = await knex.transaction();

        if(!dataProposal.propertyId || !dataProposal.userId) {
            trx.rollback();
            throw new Error("Dados obrigatórios não informados");
        }

        //check if rental proposal already exists for this property and user

        const existingRentalProposal = await (async () => {
            try {
                return await this.rentalProposalsRepository.findByPropertyIdAndUserId(dataProposal.propertyId, dataProposal.userId);
            } catch (err: any) {
                trx.rollback();
                throw new Error("Erro ao buscar proposta de aluguel");
            }
        })();

        if(existingRentalProposal) {
            trx.rollback();
            throw new Error("Proposta de aluguel já existe para este imóvel e usuário");
        }

        //check if property exists
        const existingProperty = await (async () => {
            try {
                return await this.propertiesRepository.findById(dataProposal.propertyId);
            } catch (err: any) {
                trx.rollback();
                throw new Error("Erro ao buscar imóvel");
            }
        })();

        if(!existingProperty) {
            trx.rollback();
            throw new Error("Imóvel não encontrado");
        }

        //check if property is available
        if(existingProperty.status !== PropertiesStatus.DISPONIVEL) {
            trx.rollback();
            throw new Error("Imóvel não está disponível para aluguel");
        }
        

        //update property status to EM_NEGOCIACAO

        const updatedProperty = await (async () => {
            try {
                return await this.propertiesRepository.save({ ...existingProperty, status: PropertiesStatus.EM_NEGOCIACAO }, trx);
            } catch (err: any) {
                trx.rollback();
                throw new Error("Erro ao atualizar status do imóvel");
            }
        })();

        if(!updatedProperty || updatedProperty.status !== PropertiesStatus.EM_NEGOCIACAO) {
            trx.rollback();
            throw new Error("Imóvel não foi atualizado o status");
        }

        //save rental proposal
        const rentalProposalToSave: RentalProposalsEntity = {
            id: uuidv4(),
            propertyId: dataProposal.propertyId,
            userId: dataProposal.userId,
            status: RentalProposalsStatus.NOVA,
        };

        const savedRentalProposal = await (async () => {
            try {
                return await this.rentalProposalsRepository.save(rentalProposalToSave, trx);
            } catch (err: any) {
                trx.rollback();
                throw new Error("Erro ao salvar proposta de aluguel");
            }
        })();

        if(!savedRentalProposal) {
            trx.rollback();
            throw new Error("Erro ao salvar proposta de aluguel");
        }

        const { updatedAt, createdAt, deletedAt, deletedBy, ...rentalProposalToReturn } = savedRentalProposal;

        await trx.commit();

        return rentalProposalToReturn;
    }
}