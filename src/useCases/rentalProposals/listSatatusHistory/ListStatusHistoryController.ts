import { ListStatusHistoryUseCase } from "./ListStatusHistoryUseCase";
import { Request, Response } from "express";


export class ListStatusHistoryController {
    constructor(
        private listStatusHistoryUseCase: ListStatusHistoryUseCase
    ) {
        this.controller.bind(this);
    }

    controller = async (req: Request, res: Response) => {
        const rentalProposalId = req.params.rentalProposalId as string;
        try {
            const proposalStatusHistories = await this.listStatusHistoryUseCase.execute(rentalProposalId);
            return res.status(200).json(proposalStatusHistories);
        } catch (err: any) {
            return res.status(500).json({ error: err.message });
        }
    }
}