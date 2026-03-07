import { UpdateUsersUseCase } from "./UpdateUsersUseCase";
import { usersRepository } from "../../../repositories";
import { UpdateUsersController } from "./UpdateUsersController";


const updateUsersUseCase = new UpdateUsersUseCase(usersRepository); 

const updateUsersController = new UpdateUsersController(updateUsersUseCase);

export { updateUsersUseCase, updateUsersController };