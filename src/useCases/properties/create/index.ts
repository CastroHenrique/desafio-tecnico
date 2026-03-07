import { CreatePropertiesUseCase } from "./CreatePropertiesUseCase";
import { propertiesRepository } from "../../../repositories";
import { CreatePropertiesController } from "./CreatePropertiesController";


const createPropertiesUseCase = new CreatePropertiesUseCase(propertiesRepository);

const createPropertiesController = new CreatePropertiesController(createPropertiesUseCase);

export { createPropertiesUseCase, createPropertiesController };