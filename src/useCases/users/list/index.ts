import { ListUsersUseCase } from "./ListUsersUseCase";
import { usersRepository } from "../../../repositories";
import { ListUsersController } from "./ListUsersController";


const listUsersUseCase = new ListUsersUseCase(usersRepository); 

const listUsersController = new ListUsersController(listUsersUseCase);

export { listUsersUseCase, listUsersController };