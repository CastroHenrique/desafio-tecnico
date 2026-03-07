import { usersRepository } from "../../../repositories";
import { CreateUsersController } from "./CreateUsersController";
import { CreateUsersUseCase } from "./CreateUsersUseCase";

const createUsersUseCase = new CreateUsersUseCase(usersRepository);

const createUsersController = new CreateUsersController(createUsersUseCase);

export { createUsersUseCase, createUsersController };

