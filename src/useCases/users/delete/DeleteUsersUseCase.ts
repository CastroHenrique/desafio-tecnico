import knex from "../../../knex";
import { IUsersRepository } from "../../../repositories/users/IUsersRepository";

export class DeleteUsersUseCase {
    constructor(private  usersRepository: IUsersRepository) {}

    async execute(userIds: string, userRequest: string) {
        const trx = await knex.transaction();
        const ids = userIds.split(",");

        //check if user is trying to delete itself

        if(ids.includes(userRequest)) {
            trx.rollback();
            throw new Error("Não é possível deletar o usuário que está realizando a ação");
        }

        for(const id of ids) {
            
            //check if user exists

            const hasUser = await (async () => {
                try {
                    return await this.usersRepository.findById(id);
                } catch (err: any) {
                    trx.rollback();
                    throw new Error("Erro ao buscar usuário");
                }
            })();
            

            if(!hasUser) {
                trx.rollback();
                throw new Error("Usuário não encontrado");
            };

            const deleteUser = await (async () => {
                try {
                    return await this.usersRepository.remove(id, userRequest, trx);
                } catch (err: any) {
                    trx.rollback();
                    throw new Error("Erro ao deletar usuário");
                }
            })();

            if(!deleteUser) {
                trx.rollback();
                throw new Error("Erro ao deletar usuário");
            };
        };

        await trx.commit();

        return true;
    };
}