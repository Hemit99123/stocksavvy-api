import { Request, Response } from "express";
import { db } from "../libs/db.ts";
import { user } from "../schema.ts";
import { eq } from "drizzle-orm";
import handleError from "../libs/handleError.ts";
import dotenv from "dotenv";
import axios, { AxiosError } from "axios";

dotenv.config();

const authController = {
  login: async (req: Request, res: Response) => {
    const { access_token } = req.query;

    if (req.session.user) {
      return res.status(200).json({
        message: "You are already logged in, so no need to log in again!",
        error: "already-authenticated",
      });
    }

    try {
      const response = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo`,
        {
          headers: { Authorization: `Bearer ${access_token}` },
        },
      );

      const userEmail = response.data.email;
      const userObj = await db
        .select()
        .from(user)
        .where(eq(user.email, userEmail))
        .execute();

      if (!userObj[0]) {
        await db.insert(user).values({
          email: userEmail,
          name: response.data.name,
          googleid: response.data.id,
        });
      }

      req.session.user = { email: userEmail };

      return res.json({
        message: "Successfully logged into DailySAT Platforms",
        user: {
          email: userEmail,
          name: response.data.name,
          googleid: response.data.id,
        },
      });
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        // Handling axios-specific error
        if (error.response?.status === 401) {
          return res.status(500).json({
            message: "Invalid Google token (not authenticated 401)",
            error: "invalid-token",
          });
        } else {
          handleError(res, error);
        }
      } else if (error instanceof Error) {
        handleError(res, error);
      } else {
        res.status(500).json({
          message: "An unknown error occurred.",
          error: "unknown-error",
        });
      }
    }
  },

  logOut: (req: Request, res: Response) => {
    try {
      if (req.session) {
        req.session.destroy((err) => {
          if (!err) {
            res.redirect("/auth/success");
          } else {
            res.redirect(
              '/auth/error?error="Authentication Error from Express Session',
            );
          }
        });
      } else {
        return res.status(400).json({
          message: "User is not logged in and therefore cannot be logged out",
          error: "not-authenticated",
        });
      }
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

  deleteUser: async (req: Request, res: Response) => {
    const { email } = req.session.user ?? {};

    try {
      await db
        .delete(user)
        .where(eq(user.email, email as string))
        .execute();

      res.status(200).json({
        message: "User deleted successfully",
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

  checkSession: async (req: Request, res: Response) => {
    try {
      if (req.session) {
        return res.status(200).json({
          success: true,
          session: req.user,
        });
      } else {
        return res.status(400).json({
          success: false,
          session: "none",
        });
      }
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

  error: async (req: Request, res: Response) => {
    const { error } = req.query;

    res.json({
      message:
        "An error has occurred! Please contact DailySAT executive team to get this sorted right away!",
      error: error,
    });
  },
};

export default authController;
