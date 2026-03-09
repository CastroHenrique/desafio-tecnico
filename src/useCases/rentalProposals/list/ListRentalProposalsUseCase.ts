import { IRentalProposalsRepository } from "../../../repositories/rentalProposals/IRentalProposalsRepository";

export class ListRentalProposalsUseCase {
  constructor(private rentalProposalsRepository: IRentalProposalsRepository) {}

  async execute() {
    const rentalProposals = await (async () => {
      try {
        return await this.rentalProposalsRepository.findAll();
      } catch (error: any) {
        throw new Error("Erro ao listar propostas de aluguel");
      }
    })(); 
    return rentalProposals?.map(rentalProposal => {
      const { createdAt, updatedAt, deletedAt, deletedBy, ...rentalProposalWithoutPassword } = rentalProposal;
      return rentalProposalWithoutPassword;
    });
  }
}
