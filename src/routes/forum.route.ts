import express from "express";
import forumController from "../controllers/forum.controller.js";

const router = express.Router();

router.post("/create", forumController.create)

export default router;
