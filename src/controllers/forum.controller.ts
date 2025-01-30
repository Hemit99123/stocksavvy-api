import { Request, Response } from "express";
import handleError from "../utils/handleError.js";
import { forum } from "../schema.js";
import { db } from "../utils/db.js";
import { and, eq } from "drizzle-orm";

const forumController = {
    create: async (req: Request, res: Response) => {
        const { question } = req.body;
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
        const { id } = req.body;
        const email = req.session.user?.email;

        try {

            // delete a document 
            await db
                .delete(forum)
                // Match by both email and id, this way only the owner can delete a question
                .where(eq(forum.email, email as string) && eq(forum.id, id)); 
            
            res.status(200).json({
                message: "Deleted your document successfully"
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

    getAllQuestions: async (req: Request, res: Response) => {
        try {
            const questions = await db 
                .select()
                .from(forum)
            
            res.status(200).json({
                questions
            })

        } catch(error: unknown) {
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

    getAllUserQuestions: async (req: Request, res: Response) => {
        const { email } = req.query

        try {
            const questions = await db
                .select()
                .from(forum)
                .where(eq(forum.email, email as string))
            
            res.status(200).json({
                questions,
                message: "Got all questions for user"
            })
        } catch(error: unknown) {
            if (error instanceof Error) {
                handleError(res, error);
            } else {
                res.status(500).json({
                    message: "An unexpected error occurred",
                    error: "unknown-error",
                });
            }
        }
    }
};

export default forumController;
