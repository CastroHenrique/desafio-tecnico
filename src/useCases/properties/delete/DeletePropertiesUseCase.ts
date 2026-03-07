import knex from "../../../knex";
import { IPropertiesRepository } from "../../../repositories/properties/IPropertiesRepository";

export class DeletePropertiesUseCase {
    constructor(private  propertiesRepository: IPropertiesRepository) {}

    async execute(id: string, userId: string) {

        const trx = await knex.transaction();

        const ids = id.split(",");

        for(const id of ids) {

            //check if property exists
            const property = await (async () => {
                try {
                    return await this.propertiesRepository.findById(id);
                } catch (err: any) {
                    trx.rollback();
                    throw new Error("Erro ao buscar propriedade");
                }
            })();

            if(!property) {
                trx.rollback();
                throw new Error("Propriedade não encontrada");
            }

            const deleteProperty = await (async () => {
                try {
                    return await this.propertiesRepository.remove(id, userId, trx);
                } catch (err: any) {
                    trx.rollback();
                    throw new Error("Erro ao deletar propriedade");
                }
            })();

            if(!deleteProperty) {
                trx.rollback();
                throw new Error("Erro ao deletar propriedade");
            }
        }

        trx.commit();

        return true;
    }
}