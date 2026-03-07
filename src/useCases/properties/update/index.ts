import { propertiesRepository } from "../../../repositories";
import { UpdatePropertiesController } from "./UpdatePropertiesController";
import { UpdatePropertiesUseCase } from "./UpdatePropertiesUseCase";


const updatePropertiesUseCase = new UpdatePropertiesUseCase(propertiesRepository);

const updatePropertiesController = new UpdatePropertiesController(updatePropertiesUseCase);

export { updatePropertiesUseCase, updatePropertiesController };