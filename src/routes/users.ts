import { Router } from "express";
import { createUsersController } from "../useCases/users/create";
import { deleteUsersController } from "../useCases/users/delete";
import { listUsersController } from "../useCases/users/list";
import { updateUsersController } from "../useCases/users/update";

const router = Router();

router.post("/users", createUsersController.controller);
router.delete("/users/:userAction/:userId", deleteUsersController.controller);
router.put("/users", updateUsersController.controller);
router.get("/users", listUsersController.controller);

export default router;
