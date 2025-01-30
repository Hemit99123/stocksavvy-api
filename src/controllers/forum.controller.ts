import { Request, Response } from "express";
import handleError from "../utils/handleError.js";
import { forum } from "../schema.js";
import { db } from "../utils/db.js";
import { and, eq } from "drizzle-orm";

const forumController = {
    create: async (req: Request, res: Response) => {
        const body = req.body;
        const question = body.question;
        const email = req.session.user?.email;

        if (!question || !email) {
            return res.status(400).json({
                message: "Question and email are required",
            });
        }

        try {
            // create a document
            await db
                .insert(forum)
                .values({
                    question,
                    email,
                    createdAt: new Date().toISOString() // Convert to ISO string format
                });

            res.status(201).json({
                message: "Forum question created successfully",
            });
        } catch (error: unknown) {
            if (error instanceof Error) {
                handleError(res, error);
            } else {
                res.status(500).json({
                    message: "An unexpected error occurred",
                    error: "unknown-error",
                });
            }
        }
    },

    delete: async (req: Request, res: Response) => {
        const body = req.body;
        const id = body.id;
        const email = req.session.user?.email;

        try {

            // delete a document 
            await db
                .delete(forum)
                // Match by both email and id, this way only the owner can delete a question
                .where(eq(forum.email, email as string) && eq(forum.id, id)); 
            
            
        } catch(error) {
            if (error instanceof Error) {
                handleError(res, error);
            } else {
                res.status(500).json({
                    message: "An unexpected error occurred",
                    error: "unknown-error",
                });
            }
        }
    },

    getAllQuestions: async (req: Request, res: Response) => {
        try {
            const questions = await db 
                .select()
                .from(forum)
            
            res.status(200).json({
                questions
            })

        } catch(error) {
            if (error instanceof Error) {
                handleError(res, error);
            } else {
                res.status(500).json({
                    message: "An unexpected error occurred",
                    error: "unknown-error",
                });
            }
        }
    },
};

export default forumController;
