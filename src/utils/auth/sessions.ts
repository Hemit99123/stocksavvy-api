import { Request, Response } from "express";

export const handleDestroySession = (req: Request, res: Response) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).json({ message: "Logout failed", error: err.message });
        
        // clear the session id cookie on the frontend
        res.clearCookie('session-id', { path: '/' });
        return res.json({ message: "Logged out successfully" });
  
      });
}