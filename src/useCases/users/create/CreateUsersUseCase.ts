import { AccessLevel, UserEntity } from "../../../entities/UserEntity";
import { IUsersRepository } from "../../../repositories/users/IUsersRepository";
import { CreateUsersRequestDTO } from "./CreateUsersRequestDTO";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import knex from "../../../knex";

if (process.env.NODE_ENV !== "production") {
    dotenv.config();
}

export class CreateUsersUseCase {
    constructor(private  usersRepository: IUsersRepository) {}

    async execute(userData: CreateUsersRequestDTO) {
        
        const trx = await knex.transaction();
        //check if all required fields are provided

        if(!userData.name || !userData.email || !userData.username || !userData.password || !userData.document) {
            trx.rollback();
            throw new Error("Dados obrigatórios não informados");
        };

        if(userData.password !== userData.confirmPassword) {
            trx.rollback();
            throw new Error("As senhas não conferem");
        }

        //check if user with same username or email already exists

        const userWithSameUsername = await (async () => {
            try {
                return await this.usersRepository.findByUsername(userData.username);
            } catch (err: any) {
                trx.rollback();
                throw new Error("Erro ao buscar nome de usuário");
            }
        })();

        if(userWithSameUsername) {
            throw new Error("Esse nome de usuário já está em uso");
        }

        const userWithSameEmail = await (async () => {
            try {
                return await this.usersRepository.findByEmail(userData.email || "");
            } catch (err: any) {
                trx.rollback();
                throw new Error("Erro ao buscar email");
            }
        })();
        
        if(userWithSameEmail) {
            trx.rollback();
            throw new Error("Esse email já está em uso");
        }

        //create user
        
        const userToSave: UserEntity = {
            id: uuidv4(),
            name: userData.name,
            username: userData.username,
            password: bcrypt.hashSync(userData.password, 12),
            email: userData.email,
            document: userData.document,
            accessLevel: userData.accessLevel !== undefined ? userData.accessLevel : AccessLevel.N,
            status: userData.status !== undefined ? userData.status : true,
        };

        const saveUser = await (async () => {
            try {
                return await this.usersRepository.save(userToSave);
            } catch (err: any) {
                trx.rollback();
                throw new Error("Erro ao salvar usuário no banco de dados");
            }
        })();

        const savedUser = await (async () => {
            try {
                return await this.usersRepository.findById(saveUser.id);
            } catch (err: any) {
                throw new Error("Erro ao buscar usuário salvo no banco de dados");
            }
        })();

        if(!savedUser) {
            trx.rollback();
            throw new Error("Erro ao buscar usuário salvo");
        }

        const { password, createdAt, updatedAt, deletedAt, deletedBy, ...userToReturn } = savedUser;

        await trx.commit();

        return userToReturn;
    };
}