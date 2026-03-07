import { Knex } from "knex";
import { PropertiesEntity } from "../../entities/PropertiesEntity";

export interface IPropertiesRepository {
    findAll(): Promise<PropertiesEntity[] | undefined>;
    findById(id: string, trx?: Knex.Transaction): Promise<PropertiesEntity | undefined>;
    findByReference(reference: number, trx?: Knex.Transaction): Promise<PropertiesEntity | undefined>;
    findByFullAddress(fullAddress: string, trx?: Knex.Transaction): Promise<PropertiesEntity | undefined>;
    save(property: PropertiesEntity, trx?: Knex.Transaction): Promise<PropertiesEntity>;
    remove(id: string, userId: string, trx?: Knex.Transaction): Promise<boolean>;
}