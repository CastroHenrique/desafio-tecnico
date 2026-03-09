import { Request, Response } from "express";
import { ListRentalProposalsUseCase } from "./ListRentalProposalsUseCase";

export class ListRentalProposalsController {
  constructor(private listRentalProposalsUseCase: ListRentalProposalsUseCase) {
    this.controller.bind(this);
  }

  controller = async (request: Request, response: Response) => {
    try {
      const rentalProposals = await this.listRentalProposalsUseCase.execute();
      return response.status(200).json({
        status: true,
        data: rentalProposals,
      });
    } catch (error: any) {
      return response.status(500).json({
        status: false,
        message: error.message,
        error: error.message,
      });
    }
  };
}
