import { rentalProposalsRepository } from "../../../repositories";
import { ListStatusHistoryController } from "./ListStatusHistoryController";
import { ListStatusHistoryUseCase } from "./ListStatusHistoryUseCase";


const listStatusHistoryUseCase = new ListStatusHistoryUseCase(rentalProposalsRepository);

const listStatusHistoryController = new ListStatusHistoryController(listStatusHistoryUseCase);

export { listStatusHistoryController , listStatusHistoryUseCase };