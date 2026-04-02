import { Router } from "express";
import { createGroupController, deleteGroupController, getGroupController, addUserToGroupController, removeUserFromGroupController } from "../controllers/group.controllers.js";

const router = Router();

router.post("/create", createGroupController);
router.get("/:id", getGroupController);
router.delete("/:id", deleteGroupController);
router.post("/:id/add-user", addUserToGroupController);
router.post("/:id/remove-user", removeUserFromGroupController);

export default router;