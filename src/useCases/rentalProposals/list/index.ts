import { rentalProposalsRepository } from "../../../repositories";
import { ListRentalProposalsController } from "./ListRentalProposalsController";
import { ListRentalProposalsUseCase } from "./ListRentalProposalsUseCase";

const listRentalProposalsUseCase = new ListRentalProposalsUseCase(
  rentalProposalsRepository,
);
const listRentalProposalsController = new ListRentalProposalsController(
  listRentalProposalsUseCase,
);

export { listRentalProposalsUseCase, listRentalProposalsController };
