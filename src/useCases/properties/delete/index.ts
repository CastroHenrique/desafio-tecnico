import { DeletePropertiesUseCase } from "./DeletePropertiesUseCase";
import { propertiesRepository } from "../../../repositories";
import { DeletePropertiesController } from "./DeletePropertiesController";

const deletePropertiesUseCase = new DeletePropertiesUseCase(propertiesRepository);

const deletePropertiesController = new DeletePropertiesController(deletePropertiesUseCase);

export { deletePropertiesUseCase, deletePropertiesController };