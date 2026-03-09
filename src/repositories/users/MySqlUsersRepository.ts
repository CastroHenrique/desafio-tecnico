import knex from "../../knex";
import { UserEntity } from "../../entities/UserEntity";
import { IUsersRepository } from "./IUsersRepository";
import { Knex } from "knex";
import { v4 as uuidv4 } from "uuid";

export class MySqlUsersRepository implements IUsersRepository {
    public async findAll(): Promise<UserEntity[] | undefined> {
        const users: UserEntity[] = await knex<UserEntity>("users").whereNull("deletedAt").orderBy("createdAt", "desc");

        if(users.length === 0) return undefined;

        return users
    }
    public async findById(id: string, trx?: Knex.Transaction): Promise<UserEntity | undefined> {
        const bd = trx ? trx : knex;
        
        const user = await bd<UserEntity>("users").where("id", id).whereNull("deletedAt").first();

        if(!user) return undefined;

        return user
    }
    public async findByUsername(username: string): Promise<UserEntity | undefined> {
        const user = await knex<UserEntity>("users").where("username", username).whereNull("deletedAt").first();


        if(!user) return undefined;

        return user
    }
    public async findByEmail(email: string): Promise<UserEntity | undefined> {

        const user = await knex<UserEntity>("users").where("email", email).whereNull("deletedAt").first();

        if(!user) return undefined;

        return user
    }
    public async save(user: UserEntity, trx?: Knex.Transaction): Promise<UserEntity> {
        const bd = trx ? trx : knex;
        
        const oldUser = await this.findById(user.id);

        if(oldUser){
            await bd<UserEntity>("users").where("id", user.id).update({
                name: user.name,
                username: user.username,
                password: user.password,
                document: user.document,
                email: user.email,
                accessLevel: user.accessLevel,
                status: user.status,
            });
        } else {
            if(!user.id || user.id === "") user.id = uuidv4();
            if(!user.password) throw new Error("Senha do usuário não informada");
            
            await bd<UserEntity>("users").insert({
                id: user.id,
                name: user.name,
                username: user.username,
                password: user.password,
                document: user.document,
                email: user.email,
                accessLevel: user.accessLevel,
                status: user.status,
            });
        }

        return {
            ...user,
            status: user.status ? true : false,
        };

    }
    public async remove(id: string, userId: string, trx?: Knex.Transaction): Promise<boolean> {
        const bd = trx ? trx : knex;

        const count = await bd<UserEntity>("users").where("id", id).update({ 
            deletedAt: knex.fn.now(), 
            deletedBy: userId 
        });

        return count > 0;
    }
    
}