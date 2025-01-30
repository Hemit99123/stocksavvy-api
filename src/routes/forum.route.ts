import express from "express";
import forumController from "../controllers/forum.controller.js";
import { authenticateSession } from "../middleware/session.middleware.js";

const router = express.Router();

/**
 * @swagger
 * /forum/create:
 *   post:
 *     summary: Create a new forum question
 *     tags: [Forum]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question:
 *                 type: string
 *                 example: "What is the best way to learn JavaScript?"
 *     responses:
 *       201:
 *         description: Forum question created successfully
 *       400:
 *         description: Question and email are required
 *       500:
 *         description: An unexpected error occurred
 */

/**
 * @swagger
 * /forum/delete:
 *   delete:
 *     summary: Delete a forum question
 *     tags: [Forum]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Deleted your document successfully
 *       500:
 *         description: An unexpected error occurred
 */

/**
 * @swagger
 * /forum/all-questions:
 *   get:
 *     summary: Get all forum questions
 *     tags: [Forum]
 *     responses:
 *       200:
 *         description: Retrieved all forum questions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 questions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       question:
 *                         type: string
 *                       email:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         example: "2025-01-30T12:00:00Z"
 *       500:
 *         description: An unexpected error occurred
 */

/**
 * @swagger
 * /forum/user-questions:
 *   get:
 *     summary: Get all forum questions for a specific user
 *     tags: [Forum]
 *     parameters:
 *       - in: query
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *           example: "user@example.com"
 *     responses:
 *       200:
 *         description: Retrieved all questions for the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 questions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       question:
 *                         type: string
 *                       email:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         example: "2025-01-30T12:00:00Z"
 *       500:
 *         description: An unexpected error occurred
 */

// authenticated routes
router.post("/create", authenticateSession, forumController.create);
router.delete("/delete", authenticateSession, forumController.delete);


// unauthenticated routes
router.get("/all-questions", forumController.getAllQuestions);
router.get("/user-questions", forumController.getAllUserQuestions);

export default router;
