import { Knex } from "knex";
import { UserEntity } from "../../entities/UserEntity";


export interface IUsersRepository {
    findAll(): Promise<UserEntity[] | undefined>;
    findById(id: string): Promise<UserEntity | undefined>;
    findByUsername(username: string): Promise<UserEntity | undefined>;
    findByEmail(email: string, trx?: Knex.Transaction): Promise<UserEntity | undefined>;
    save(user: UserEntity, trx?: Knex.Transaction): Promise<UserEntity>;
    remove(id: string, userId: string, trx?: Knex.Transaction): Promise<boolean>;
}