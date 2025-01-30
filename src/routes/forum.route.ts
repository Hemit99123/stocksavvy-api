import express from "express";
import forumController from "../controllers/forum.controller.js";
import { authenticateSession } from "../middleware/session.middleware.js";

const router = express.Router();

router.post("/create", authenticateSession, forumController.create)
router.delete("/delete", authenticateSession, forumController.delete)

// These routes are for guests too (no need to be authenticated)
router.get("/all-questions", forumController.getAllQuestions)


export default router;
