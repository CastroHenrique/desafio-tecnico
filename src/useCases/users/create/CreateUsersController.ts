import { Request, Response } from "express";
import { CreateUsersUseCase } from "./CreateUsersUseCase";


export class CreateUsersController {

    constructor(
        private createUsersUseCase: CreateUsersUseCase
    ) {
        this.controller.bind(this);
    }

    controller = async (request: Request, response: Response) => {
        const userData = request.body;

        try {
          
            const user = await this.createUsersUseCase.execute(userData);

            response.status(201).json({
                status: true,
                data: user
            });
        } catch (err: any) {
            return response.status(500).json({
                status: false,
                message: err.message,
                error: err.message
            });
        }
    };
};