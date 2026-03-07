import { propertiesRepository, rentalProposalsRepository } from "../../../repositories";
import { CreateRentalProposalsController } from "./CreateRentalProposalsController";
import { CreateRentalProposalsUseCase } from "./CreateRentalProposalsUseCase";


const createRentalProposalsUseCase = new CreateRentalProposalsUseCase(rentalProposalsRepository, propertiesRepository);
const createRentalProposalsController = new CreateRentalProposalsController(createRentalProposalsUseCase);

export { createRentalProposalsUseCase, createRentalProposalsController };