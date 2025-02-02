import { Request, Response } from "express";
import { db } from "../utils/db.js";
import { user } from "../schema.js";
import { eq } from "drizzle-orm";
import handleError from "../utils/handleError.js";
import { OAuth2Client } from "google-auth-library";
import { handleDestroySession } from "../utils/auth/sessions.js";
import { findUserOrAdd } from "../utils/auth/findUser.js";
import { redisClient } from "../utils/auth/redis.js";
import { transporter } from "../utils/nodemailer.js";

const client = new OAuth2Client();

// This ensures a uniform keyname for all the times we access otp redis keys
const redisKeyName = (email: string) => {
  return `otp:${email}`
}

const authController = {
  loginGoogle: async (req: Request, res: Response) => {
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

      // this returns a true/false based on the type given, if it is the same as user obj we can continue!
      const continueLogin = await findUserOrAdd(userEmail, userName, "google")

      if (continueLogin) {
        req.session.user = { email: userEmail };
        res.json({ message: "Successfully logged in", name: userName});
      } else {
        res.json({messag: "This email is in-use by email provider", error: "no-login"})
      }

    } catch (error) {
      handleError(res, error);
    }
  },

  assignOtp: async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      const random4DigitNumber = Math.floor(1000 + Math.random() * 9000);

      await redisClient.set(redisKeyName(email), random4DigitNumber, 'EX', 180)

      const mailOptions = {
        to: email,
        subject: "Your OTP - StockSavvy",
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f9f9f9;
              }
              .email-container {
                max-width: 600px;
                margin: 20px auto;
                padding: 20px;
                background-color: #ffffff;
                border: 1px solid #ddd;
                border-radius: 8px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
              }
              .header {
                text-align: center;
                padding-bottom: 20px;
                border-bottom: 1px solid #ddd;
              }
              .header h1 {
                margin: 0;
                color: #286A4D; /* Updated color */
              }
              .otp {
                font-size: 24px;
                font-weight: bold;
                color: #286A4D; /* Updated color */
                text-align: center;
                margin: 20px 0;
              }
              .footer {
                font-size: 14px;
                color: #666;
                text-align: center;
                margin-top: 20px;
              }
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header">
                <h1>StockSavvy</h1>
              </div>
              <p>Hello,</p>
              <p>Use the following One-Time Password (OTP) to complete your verification process:</p>
              <div class="otp">${random4DigitNumber}</div>
              <p>This OTP is only valid for 3 minutes.</p>
              <div class="footer">
                <p>If you did not request this, please ignore this email.</p>
              </div>
            </div>
          </body>
          </html>
        `,
      };

      // sending the email to the user
      await transporter.sendMail(mailOptions);  

      res.json({
        message: "Sent email to user with OTP!"
      })
    } catch (error) {
      handleError(res, error)
    }
  },

  loginEmailMagic: async (req: Request, res: Response) => {
    try {
      const { email, name, otp } = req.body;

      const continueLogin = await findUserOrAdd(email, name, "email")

      const otpFromEmail = await redisClient.get(redisKeyName(email))

      if (otpFromEmail == otp && continueLogin) {
        // assign the session
        req.session.user = {email}

        // this deletes the otp right after its used (one-use)
        redisClient.del(redisKeyName(email))
        res.json({ message: "Successfully logged in", name});
      } else {
        throw new Error(
          otpFromEmail !== otp 
            ? "Invalid OTP" 
            : !continueLogin 
              ? "This email is in-use by the google provider" 
              : "An unexpected error occurred"
        );      
      }
    } catch (error) {
      handleError(res,error)
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
      res.json({ success: false, session: "none" });
    } catch (error) {
      handleError(res, error);
    }
  },
};

export default authController;
