import { UserEntity } from "../../../entities/UserEntity";
import knex from "../../../knex";
import { IUsersRepository } from "../../../repositories/users/IUsersRepository";
import { UpdateUsersRequestDTO } from "./UpdateUsersRequestDTO";
import bcrypt from "bcrypt";

export class UpdateUsersUseCase {
    constructor(private  usersRepository: IUsersRepository) {}

    async execute(userData: UpdateUsersRequestDTO) {

        const trx = await knex.transaction();

        //check if all required fields are provided

        if(userData.id || !userData.name || !userData.email || !userData.username || !userData.document) {
            trx.rollback();
            throw new Error("Dados obrigatórios não informados");
        };

        if(userData.password && userData.password === "") {
            trx.rollback();
            throw new Error("Senha não informada");
        }

        //find old user

        const oldUser = await (async () => {
            try {
                return await this.usersRepository.findById(userData.id);
            } catch (err: any) {
                trx.rollback();
                throw new Error("Erro ao buscar usuário");
            }
        })();

        if(!oldUser) {
            trx.rollback();
            throw new Error("Usuário não encontrado");
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

        if(userWithSameUsername && userWithSameUsername.id !== oldUser.id) {
            throw new Error("Esse nome de usuário já está em uso");
        }

        if(userData.email) {
            const userWithSameEmail = await (async () => {
                try {
                    return await this.usersRepository.findByEmail(userData.email || "");
                } catch (err: any) {
                    trx.rollback();
                    throw new Error("Erro ao buscar email");
                }
            })();
            
            if(userWithSameEmail && userWithSameEmail.id !== oldUser.id) {
                trx.rollback();
                throw new Error("Esse email já está em uso");
            }
        }

        //create user
        
        const userToSave: UserEntity = {
            ...oldUser,
            name: userData.name,
            username: userData.username,
            password: userData.password ? bcrypt.hashSync(userData.password, 12) : oldUser.password,
            email: userData.email ? userData.email : oldUser.email,
            document: userData.document ? userData.document : oldUser.document,
            accessLevel: userData.accessLevel !== undefined ? userData.accessLevel : oldUser.accessLevel,
            status: userData.status !== undefined ? userData.status : oldUser.status,
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
        
    }
}