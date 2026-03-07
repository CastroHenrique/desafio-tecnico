import { ListPropertiesUseCase } from "./ListPropertiesUseCase";
import { propertiesRepository } from "../../../repositories";
import { ListPropertiesController } from "./ListPropertiesController";

const listPropertiesUseCase = new ListPropertiesUseCase(propertiesRepository);

const listPropertiesController = new ListPropertiesController(listPropertiesUseCase);

export { listPropertiesUseCase, listPropertiesController };