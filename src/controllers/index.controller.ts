import { Request, Response } from "express";

const indexController = {
  get: (req: Request, res: Response) => {
    res.json({
      name: "StockSavvy Backend",
      author: "Hemit Patel",
      date_created: "December 24 2024",
      message: "Let's change the world 🚀",
    });
  },
};

export default indexController;
