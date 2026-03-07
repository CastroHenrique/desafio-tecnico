import { Request } from "express";
import { IPropertiesRepository } from "../../../repositories/properties/IPropertiesRepository";


export class ListPropertiesUseCase {
    constructor(private  propertiesRepository: IPropertiesRepository) {}

    async execute(query: Request["query"]) {

        const properties = await (async () => {
            try {
                return await this.propertiesRepository.findAll();
            } catch (err: any) {
                throw new Error("Erro ao buscar propriedades");
            }
        })();


        return properties?.map((property) => {
            const {deletedAt,deletedBy, createdAt, updatedAt, ...propertyToReturn} = property;
            return propertyToReturn;
        });
    };
}