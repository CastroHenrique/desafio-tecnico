import { Request, Response } from "express";
import { CreatePropertiesUseCase } from "./CreatePropertiesUseCase";


export class CreatePropertiesController {
    constructor(private  createPropertiesUseCase: CreatePropertiesUseCase) {
        this.controller.bind(this);
    }

    controller = async (request: Request, response: Response) => {
        const propertyData = request.body;

        try {
            const properties = await this.createPropertiesUseCase.execute(propertyData);

            response.status(200).json({
                status: true,
                data: properties
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