import { Request, Response } from "express";
import { ListPropertiesUseCase } from "./ListPropertiesUseCase";


export class ListPropertiesController {
    constructor(private  listPropertiesUseCase: ListPropertiesUseCase) {
        this.controller.bind(this);
    }

    controller = async (request: Request, response: Response) => {
        
        try {
            const properties = await this.listPropertiesUseCase.execute(request.query);

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
    };
}