import { PropertiesStatus } from "../../../entities/PropertiesEntity";
import { RentalProposalsEntity, RentalProposalsStatus } from "../../../entities/RentalProposals";
import knex from "../../../knex";
import { IPropertiesRepository } from "../../../repositories/properties/IPropertiesRepository";
import { IRentalProposalsRepository } from "../../../repositories/rentalProposals/IRentalProposalsRepository";
import { UpdateRentalProposalsRequestDTO } from "./UpdateRentalProposalsRequestDTO";


export class UpdateRentalProposalsUseCase {

    private readonly VALID_TRANSITIONS: Record<RentalProposalsStatus, RentalProposalsStatus[]> = {
        [RentalProposalsStatus.NOVA]: [RentalProposalsStatus.ANALISE_CREDITO, RentalProposalsStatus.CANCELADA],
        [RentalProposalsStatus.ANALISE_CREDITO]: [RentalProposalsStatus.CONTRATO_EMITIDO, RentalProposalsStatus.REPROVADA, RentalProposalsStatus.CANCELADA],
        [RentalProposalsStatus.CONTRATO_EMITIDO]: [RentalProposalsStatus.ASSINADO, RentalProposalsStatus.CANCELADA],
        [RentalProposalsStatus.ASSINADO]: [RentalProposalsStatus.ATIVO, RentalProposalsStatus.CANCELADA],
        [RentalProposalsStatus.ATIVO]: [],
        [RentalProposalsStatus.REPROVADA]: [],
        [RentalProposalsStatus.CANCELADA]: [],
    };
    constructor(
        private rentalProposalsRepository: IRentalProposalsRepository,
        private propertiesRepository: IPropertiesRepository
    ) {}

    async execute(dataProposal: UpdateRentalProposalsRequestDTO) {
        const trx = await knex.transaction();

        try {
            //ckeck data proposal
            if(!dataProposal.id || !dataProposal.status) {
                throw new Error("ID e status são obrigatórios");
            }
            //check if proposal exists
            const existingProposal = await this.rentalProposalsRepository.findById(dataProposal.id);
            if(!existingProposal) throw new Error("Proposta de aluguel não encontrada");

            //check if property exists
            const property = await this.propertiesRepository.findById(existingProposal.propertyId);
            if(!property) throw new Error("Imóvel não encontrado");

            const currentStatus = existingProposal.status;
            const nextStatus = dataProposal.status;

            const isValidTransition = this.VALID_TRANSITIONS[currentStatus];
            if(!isValidTransition.includes(nextStatus)) throw new Error(`Transição inválida de ${currentStatus} para ${nextStatus}`);

            //update property status
            if(nextStatus === RentalProposalsStatus.ATIVO) {
                await this.propertiesRepository.save({
                    ...property, status: PropertiesStatus.ALUGADO,
                }, trx);
            } else if (nextStatus === RentalProposalsStatus.CANCELADA || nextStatus === RentalProposalsStatus.REPROVADA) {
                await this.propertiesRepository.save({
                    ...property, status: PropertiesStatus.DISPONIVEL,
                }, trx);
            }

            //update rental proposal status
            const updatedRentalProposal = await this.rentalProposalsRepository.save({
                ...existingProposal,
                status: nextStatus,
            }, trx);

            const addedProposalStatusHistory = await this.rentalProposalsRepository.addProposalStatusHistory(existingProposal.id, currentStatus, nextStatus, trx);
            if(!addedProposalStatusHistory) throw new Error("Erro ao adicionar histórico de status da proposta de aluguel");

            const { updatedAt, createdAt, deletedAt,deletedBy, ...rentalProposalToReturn } = updatedRentalProposal;

            await trx.commit();

            return rentalProposalToReturn;


        } catch (err: any) {
            trx.rollback();
            throw new Error(err.message || "Erro ao atualizar proposta de aluguel");
        }
    }
};