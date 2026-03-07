import { Request, Response } from "express";
import { UpdateUsersUseCase } from "./UpdateUsersUseCase";

export class UpdateUsersController {
    constructor(private  updateUsersUseCase: UpdateUsersUseCase) {
        this.controller.bind(this);
    }

    controller = async (request: Request, response: Response) => {
        const userData = request.body;

        try {
            const users = await this.updateUsersUseCase.execute(userData);

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