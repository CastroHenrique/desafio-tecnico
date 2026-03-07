import { Request, Response } from "express";
import { UpdateRentalProposalsUseCase } from "./UpdateRentalProposalsUseCase";

export class UpdateRentalProposalsController {
    constructor(private updateRentalProposalsUseCase: UpdateRentalProposalsUseCase) {}

    controller = async (request: Request, response: Response) => {
        const proposalData = request.body;

        try {
            const proposal = await this.updateRentalProposalsUseCase.execute(proposalData);
            return response.status(200).json({
                status: true,
                data: proposal
            });
        } catch (error: any) {
            return response.status(500).json({ 
                status: false,
                message: error.message,
                error: error.message
            });
        }
    }
}