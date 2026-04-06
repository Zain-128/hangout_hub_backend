import { Router } from "express";
import { createJoinRequestController, getAllJoinRequestsForAGroupController, acceptOrRejectJoinRequestController } from "../controllers/joinRequest.controllers.js";

const router = Router();

router.post("/create", createJoinRequestController);
router.get("/:id", getAllJoinRequestsForAGroupController);
router.put("/:id/accept", acceptOrRejectJoinRequestController);
router.put("/:id/reject", acceptOrRejectJoinRequestController);

export default router;