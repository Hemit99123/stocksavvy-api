import express from "express";
import forumController from "../controllers/forum.controller.js";
import { authenticateSession } from "../middleware/session.middleware.js";

const router = express.Router();

router.post("/create", authenticateSession, forumController.create)

export default router;
