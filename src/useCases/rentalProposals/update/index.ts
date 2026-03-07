import { propertiesRepository, rentalProposalsRepository } from "../../../repositories";
import { UpdateRentalProposalsController } from "./UpdateRentalProposalsController";
import { UpdateRentalProposalsUseCase } from "./UpdateRentalProposalsUseCase";



const updateRentalProposalsUseCase = new UpdateRentalProposalsUseCase(rentalProposalsRepository, propertiesRepository);
const updateRentalProposalsController = new UpdateRentalProposalsController(updateRentalProposalsUseCase);

export { updateRentalProposalsUseCase, updateRentalProposalsController };