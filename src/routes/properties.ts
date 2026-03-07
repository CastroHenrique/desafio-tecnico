import { Router } from "express";
import { listPropertiesController } from "../useCases/properties/list";
import { createPropertiesController } from "../useCases/properties/create";
import { deletePropertiesController } from "../useCases/properties/delete";
import { updatePropertiesController } from "../useCases/properties/update";


const router = Router();

router.get("/properties", listPropertiesController.controller);
router.post("/properties", createPropertiesController.controller);
router.put("/properties/:id", updatePropertiesController.controller);
router.delete("/properties/:id", deletePropertiesController.controller);   


export default router;