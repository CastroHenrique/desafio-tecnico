import { Request, Response } from "express";
import { DeletePropertiesUseCase } from "./DeletePropertiesUseCase";

export class DeletePropertiesController {
    constructor(private  deletePropertiesUseCase: DeletePropertiesUseCase) {
        this.controller.bind(this);
    }

    controller = async (request: Request, response: Response) => {
        const id = request.params.id as string;
        const userId = request.params.userId as string;

        try {
            const deletedProperty = await this.deletePropertiesUseCase.execute(id, userId);

            response.status(200).json({
                status: true,
                data: deletedProperty
            });
        } catch (err: any) {
            return response.status(500).json({
                status: false,
                message: err.message,
                error: err.message
            });
        }
    };
}