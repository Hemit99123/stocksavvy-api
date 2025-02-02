import { Request, Response } from "express";
import { db } from "../utils/db.js";
import { user } from "../schema.js";
import { eq } from "drizzle-orm";
import handleError from "../utils/handleError.js";
import { OAuth2Client } from "google-auth-library"; // Google's recommended method for token verification

const client = new OAuth2Client();

const authController = {
    login: async (req: Request, res: Response) => {
      const { access_token } = req.body;
  
      if (!access_token) {
        return res.status(400).json({
          message: "Access token is required",
          error: "missing-token",
        });
      }
  
      if (req.session?.user) {
        return res.status(200).json({
          message: "You are already logged in, so no need to log in again!",
          error: "already-authenticated",
        });
      }
  
      try {
        // Use Google's recommended token verification method
        const ticket = await client.verifyIdToken({
          idToken: access_token,
          audience: "349763756076-d3e7heso49g7guilorqri9k3n2u3krbm.apps.googleusercontent.com", // Ensure this is set in your environment
        });
  
        const payload = ticket.getPayload();
        if (!payload) {
          throw new Error("Invalid token payload");
        }
  
        const userEmail = payload.email;
        const userName = payload.name || "Unknown";
        const googleId = payload.sub;
  
        if (!userEmail) {
          return res.status(400).json({
            message: "Google token does not contain an email",
            error: "invalid-token",
          });
        }
  
        // Check if user exists in the database
        let userObj = await db
          .select()
          .from(user)
          .where(eq(user.email, userEmail))
          .execute();
  
        if (userObj.length === 0) {
          // Insert new user
          await db.insert(user).values({
            email: userEmail,
            name: userName,
            googleid: googleId,
          });
  
          // Re-fetch the user after insertion
          userObj = await db
            .select()
            .from(user)
            .where(eq(user.email, userEmail))
            .execute();
        }
  
        req.session.user = { email: userEmail };
  
        return res.json({
          message: "Successfully logged into DailySAT Platforms",
          user: {
            email: userEmail,
            name: userName,
            googleid: googleId,
          },
        });
      } catch (error: unknown) {
        return res.status(500).json({
          message: "An error occurred during login",
          error: error instanceof Error ? error.message : "unknown-error",
        });
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
