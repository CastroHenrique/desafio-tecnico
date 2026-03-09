import { IRentalProposalsRepository } from "../../../repositories/rentalProposals/IRentalProposalsRepository";

export class ListStatusHistoryUseCase {
    constructor(
        private rentalProposalsRepository: IRentalProposalsRepository
    ) {}
    
    async execute(rentalProposalId: string) {
        

        const proposalStatusHistories = await (async () => {
            try {
                return await this.rentalProposalsRepository.findProposalStatusHistoryByRentalProposalId(rentalProposalId);
            } catch (err: any) {
                throw new Error(err.message || "Erro ao listar histórico de status da proposta de aluguel");
            }
        })();

        if(!proposalStatusHistories) {
            throw new Error("Histórico de status da proposta de aluguel não encontrado");
        }
        
        return proposalStatusHistories.map((proposalStatusHistory) => {
            const { createdAt, deletedAt,deletedBy, ...proposalStatusHistoryToReturn } = proposalStatusHistory;
            return proposalStatusHistoryToReturn;
        });
    };

}