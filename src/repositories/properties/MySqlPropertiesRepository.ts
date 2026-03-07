import knex from "../../knex";
import type { PropertiesEntity } from "../../entities/PropertiesEntity";
import type { IPropertiesRepository } from "./IPropertiesRepository";
import type { Knex } from "knex";
import { v4 as uuidv4 } from "uuid";

export class MySqlPropertiesRepository implements IPropertiesRepository {
    public async findAll(): Promise<PropertiesEntity[] | undefined> {

        const properties: PropertiesEntity[] = await knex<PropertiesEntity>("properties").whereNull("deletedAt").orderBy("createdAt", "desc");

        if(properties.length === 0) return undefined;

        return properties;
    }
    public async findById(id: string, trx?: Knex.Transaction): Promise<PropertiesEntity | undefined> {
        const bd = trx ? trx : knex;
        
        const properties = await bd<PropertiesEntity>("properties").where("id", id).whereNull("deletedAt").first();

        if(!properties) return undefined;

        return properties;
    }
    public async findByReference(reference: number, trx?: Knex.Transaction): Promise<PropertiesEntity | undefined> {

        const properties = await knex<PropertiesEntity>("properties").where("reference", reference).whereNull("deletedAt").first();

        if(!properties) return undefined;

        return properties;
    }
    public async findByFullAddress(fullAddress: string, trx?: Knex.Transaction): Promise<PropertiesEntity | undefined> {
        const bd = trx ? trx : knex;

        const properties = await bd<PropertiesEntity>("properties").where("fullAddress", fullAddress).whereNull("deletedAt").first();

        if(!properties) return undefined;

        return properties;
    }


    public async save(property: PropertiesEntity, trx?: Knex.Transaction): Promise<PropertiesEntity> {
        const bd = trx ? trx : knex;

        const oldProperty = await this.findById(property.id);

        if(oldProperty){
            await bd<PropertiesEntity>("properties").where("id", property.id).update({
                ...property,
                price: property.price,
                addressZipCode: property.addressZipCode,
                addressStreet: property.addressStreet,
                addressNumber: property.addressNumber,
                addressComplement: property.addressComplement,
                addressNeighborhood: property.addressNeighborhood,
                addressCity: property.addressCity,
                addressState: property.addressState,
                status: property.status,
            });
        } else {
            if(!property.id || property.id === "") property.id = uuidv4();

            await bd<PropertiesEntity>("properties").insert({
                id: property.id,
                price: property.price,
                addressZipCode: property.addressZipCode,
                addressStreet: property.addressStreet,
                addressNumber: property.addressNumber,
                addressComplement: property.addressComplement,
                addressNeighborhood: property.addressNeighborhood,
                addressCity: property.addressCity,
                addressState: property.addressState,
                status: property.status,
            });
        }
        return property;
    }
    public async remove(id: string, userId: string, trx?: Knex.Transaction): Promise<boolean> {
        const bd = trx ? trx : knex;

        const count = await bd<PropertiesEntity>("properties").where("id", id).update({ 
            deletedAt: knex.fn.now(), 
            deletedBy: userId 
        });

        return count > 0;
    }
    
}