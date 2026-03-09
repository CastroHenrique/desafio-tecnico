import { PropertiesEntity, PropertiesStatus } from "../../../entities/PropertiesEntity";
import knex from "../../../knex";
import { IPropertiesRepository } from "../../../repositories/properties/IPropertiesRepository";
import { CreatePropertiesRequestDTO } from "./CreatePropertiesRequestDTO";
import { v4 as uuidv4 } from "uuid";

export class CreatePropertiesUseCase {
    constructor(private  propertiesRepository: IPropertiesRepository) {}

    async execute(propertyData: CreatePropertiesRequestDTO) {
        const trx = await knex.transaction();

        //check if all required fields are provided

        if(!propertyData.price || !propertyData.addressZipCode || !propertyData.addressStreet || !propertyData.addressNumber || !propertyData.addressNeighborhood || !propertyData.addressCity || !propertyData.addressState) {
            trx.rollback();
            throw new Error("Dados obrigatórios não informados");
        }

        //check if property with same name already exists

        const fullAddress = `${propertyData.addressZipCode} |--| ${propertyData.addressStreet} |--| ${propertyData.addressNumber} |--| ${propertyData.addressComplement} |--| ${propertyData.addressNeighborhood} |--| ${propertyData.addressCity} |--| ${propertyData.addressState}`;

        const propertyWithSameName = await (async () => {
            try {
                return await this.propertiesRepository.findByFullAddress(fullAddress.toLowerCase());
            } catch (err: any) {
                trx.rollback();
                throw new Error("Erro ao buscar propriedade");
            }
        })();
        
        if(propertyWithSameName) {
            trx.rollback();
            throw new Error("Propriedade com o mesmo endereço já existe");
        }

        //create property

        const propertyToSave: PropertiesEntity = {
            id: uuidv4(),
            price: propertyData.price,
            addressZipCode: propertyData.addressZipCode,
            addressStreet: propertyData.addressStreet,
            addressNumber: propertyData.addressNumber,
            addressComplement: propertyData.addressComplement || "",
            addressNeighborhood: propertyData.addressNeighborhood,
            addressCity: propertyData.addressCity,
            addressState: propertyData.addressState,
            fullAddress: fullAddress,
            status: PropertiesStatus.DISPONIVEL,
        }

        const savedProperty = await (async () => {
            try {
                return await this.propertiesRepository.save(propertyToSave, trx);
            } catch (err: any) {
                trx.rollback();
                throw new Error("Erro ao salvar propriedade no banco de dados");
            }
        })();

        if(!savedProperty) {
            trx.rollback();
            throw new Error("Erro ao salvar propriedade");
        }

        const {deletedAt,deletedBy, createdAt, updatedAt, ...propertyToReturn} = savedProperty;

        trx.commit();

        return propertyToReturn;
    }
}