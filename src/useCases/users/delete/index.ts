import { usersRepository } from "../../../repositories";
import { DeleteUsersController } from "./DeleteUsersController";
import { DeleteUsersUseCase } from "./DeleteUsersUseCase";

const deleteUsersUseCase = new DeleteUsersUseCase(usersRepository);

const deleteUsersController = new DeleteUsersController(deleteUsersUseCase);

export { deleteUsersUseCase, deleteUsersController };
