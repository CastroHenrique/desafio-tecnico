import { Request, Response } from "express";
import { CreateRentalProposalsUseCase } from "./CreateRentalProposalsUseCase";


export class CreateRentalProposalsController {

    constructor(private createRentalProposalsUseCase: CreateRentalProposalsUseCase) {
        this.controller.bind(this);
    }

    controller = async (request: Request, response: Response) => {
        const data = request.body;

        try {  
            
            const rentalProposal = await this.createRentalProposalsUseCase.execute(data);

            response.status(201).json({
                status: true,
                data: rentalProposal
            });
        } catch (error: any) {
            return response.status(500).json({
                status: false,
                message: error.message,
                error: error.message
            });
        }
    }
};