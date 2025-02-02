import { Request, Response } from "express";
import { db } from "../utils/db.js";
import { user } from "../schema.js";
import { eq } from "drizzle-orm";
import handleError from "../utils/handleError.js";
import { OAuth2Client } from "google-auth-library";
import { handleDestroySession } from "../utils/sessions.js";

const client = new OAuth2Client();

const authController = {
  login: async (req: Request, res: Response) => {
    try {
      const { idToken } = req.body;
      if (!idToken) {
        return res.status(400).json({ message: "Access token is required", error: "missing-token" });
      }
      if (req.session?.user) {
        return res.status(200).json({ message: "Already logged in!", error: "already-authenticated" });
      }

      const ticket = await client.verifyIdToken({ idToken: idToken, audience: process.env.GOOGLE_CLIENT_ID });
      const payload = ticket.getPayload();
      if (!payload || !payload.email) {
        return res.status(400).json({ message: "Invalid Google token", error: "invalid-token" });
      }

      const userEmail = payload.email;
      const userName = payload.name || "Unknown";
      const googleId = payload.sub;

      let userObj = await db.select().from(user).where(eq(user.email, userEmail)).execute();
      if (userObj.length === 0) {
        await db.insert(user).values({ email: userEmail, name: userName, googleid: googleId });
        userObj = await db.select().from(user).where(eq(user.email, userEmail)).execute();
      }

      req.session.user = { email: userEmail };
      res.json({ message: "Successfully logged in", name: userName, googleid: googleId });
    } catch (error) {
      handleError(res, error);
    }
  },

  logout: (req: Request, res: Response) => {
    try {
      if (!req.session?.user) {
        return res.status(400).json({ message: "Not logged in", error: "not-authenticated" });
      }
      handleDestroySession(req, res);
    } catch (error) {
      handleError(res, error);
    }
  },

  deleteUser: async (req: Request, res: Response) => {
    try {
      const { email } = req.session.user ?? {};
      if (!email) {
        return res.status(400).json({ message: "No user in session", error: "not-authenticated" });
      }
      await db.delete(user).where(eq(user.email, email)).execute();
      handleDestroySession(req, res);
    } catch (error) {
      handleError(res, error);
    }
  },

  checkSession: (req: Request, res: Response) => {
    try {
      if (req.session?.user) {
        return res.json({ success: true, session: req.session.user });
      }
      res.status(400).json({ success: false, session: "none" });
    } catch (error) {
      handleError(res, error);
    }
  },

  error: (req: Request, res: Response) => {
    try {
      res.json({ message: "An error occurred. Contact support.", error: req.query.error || "unknown" });
    } catch (error) {
      handleError(res, error);
    }
  },
};

export default authController;
