import { PropertiesEntity, PropertiesStatus } from "../../../entities/PropertiesEntity";
import knex from "../../../knex";
import { IPropertiesRepository } from "../../../repositories/properties/IPropertiesRepository";
import { UpdatePropertiesRequestDTO } from "./UpdatePropertiesRequestDTO";


export class UpdatePropertiesUseCase {
    constructor(private  propertiesRepository: IPropertiesRepository) {}

    async execute(propertyData: UpdatePropertiesRequestDTO) {
        const trx = await knex.transaction();

        if(!propertyData.price || !propertyData.addressZipCode || !propertyData.addressStreet || !propertyData.addressNumber || !propertyData.addressNeighborhood || !propertyData.addressCity || !propertyData.addressState || !propertyData.reference) {
            trx.rollback();
            throw new Error("Dados obrigatórios não informados");
        }

        //check if property exists
        const oldProperty = await (async () => {
            try {
                return await this.propertiesRepository.findById(propertyData.id);
            } catch (err: any) {
                trx.rollback();
                throw new Error("Erro ao buscar propriedade");
            }
        })();

        if(!oldProperty) {
            trx.rollback();
            throw new Error("Propriedade não encontrada");
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
        
        if(propertyWithSameName && propertyWithSameName.id !== propertyData.id) {
            trx.rollback();
            throw new Error("Propriedade com o mesmo endereço já existe");
        }

        //create property

        const propertyToSave: PropertiesEntity = {
            ...oldProperty,
            price: propertyData.price,
            addressZipCode: propertyData.addressZipCode,
            addressStreet: propertyData.addressStreet,
            addressNumber: propertyData.addressNumber,
            addressComplement: propertyData.addressComplement || "",
            addressNeighborhood: propertyData.addressNeighborhood,
            addressCity: propertyData.addressCity,
            addressState: propertyData.addressState,
            fullAddress: fullAddress,
            status: propertyData.status || oldProperty.status,
        }

        const savedProperty = await (async () => {
            try {
                return await this.propertiesRepository.save(propertyToSave, trx);
            } catch (err: any) {
                trx.rollback();
                throw new Error("Erro ao salvar propriedade");
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
};