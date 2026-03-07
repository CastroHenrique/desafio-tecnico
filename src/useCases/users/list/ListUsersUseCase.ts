import { Request } from "express";
import { IUsersRepository } from "../../../repositories/users/IUsersRepository";


export class ListUsersUseCase {
    constructor(private  usersRepository: IUsersRepository) {}

    async execute(query: Request["query"]) {


        //to-do: add query to filter users

        const user = await (async () => {
            try {
                return await this.usersRepository.findAll();
            } catch (err: any) {
                throw new Error("Erro ao buscar usuários");
            }
        })();

        return user;
    }
}   