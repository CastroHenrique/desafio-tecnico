import { Request, Response } from "express";
import { ListUsersUseCase } from "./ListUsersUseCase";


export class ListUsersController {
    constructor(private  listUsersUseCase: ListUsersUseCase) {
        this.controller.bind(this);
    }

    controller = async (request: Request, response: Response) => {
        try {
            const users = await this.listUsersUseCase.execute(request.query);

            response.status(200).json({
                status: true,
                data: users
            });
            
        } catch (err: any) {
            return response.status(500).json({
                status: false,
                message: err.message,
                error: err.message
            });
        }
    }
}