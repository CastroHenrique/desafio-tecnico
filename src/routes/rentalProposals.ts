import { Router } from "express";
import { createRentalProposalsController } from "../useCases/rentalProposals/create";
import { listRentalProposalsController } from "../useCases/rentalProposals/list";
import { listStatusHistoryController } from "../useCases/rentalProposals/listSatatusHistory";
import { updateRentalProposalsController } from "../useCases/rentalProposals/update";

const router = Router();

router.get("/rentalProposals", listRentalProposalsController.controller);
router.post(
  "/rentalProposals",
  createRentalProposalsController.controller,
);
router.put("/rentalProposals", updateRentalProposalsController.controller);
router.get(
  "/rentalProposals/:rentalProposalId/statusHistory",
  listStatusHistoryController.controller,
);

export default router;
