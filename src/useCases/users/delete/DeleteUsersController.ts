import { Request, Response } from "express";
import { DeleteUsersUseCase } from "./DeleteUsersUseCase";


export class DeleteUsersController {
    constructor(private  deleteUsersUseCase: DeleteUsersUseCase) {
        this.controller.bind(this);
    }

    controller = async (request: Request, response: Response) => {
        const userId = request.params.userId as string;
        const userRequest = request.params.userAction as string;

        try {
            const deletedUsers = await this.deleteUsersUseCase.execute(userId, userRequest);

            response.status(200).json({
                status: true,
                data: deletedUsers
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