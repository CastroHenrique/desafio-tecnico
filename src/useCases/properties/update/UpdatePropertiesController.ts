import { Request, Response } from "express";
import { UpdatePropertiesUseCase } from "./UpdatePropertiesUseCase";


export class UpdatePropertiesController {
    constructor(private  updatePropertiesUseCase: UpdatePropertiesUseCase) {
        this.controller.bind(this);
    }

    controller = async (request: Request, response: Response) => {

        const propertyData = request.body;

        try {
            const updatedProperty = await this.updatePropertiesUseCase.execute(propertyData);

            response.status(200).json({
                status: true,
                data: updatedProperty
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