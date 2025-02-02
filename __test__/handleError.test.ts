import { Response } from "express";
import handleError from "../src/utils/handleError";  // Replace with the correct path

// Mock Response object from Express
const mockResponse = (): Response => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnThis(); // Chainable mock for `status`
  res.json = jest.fn().mockReturnThis(); // Chainable mock for `json`
  return res;
};

describe("handleError", () => {
  it("should respond with status 500 and error message if error is an instance of Error", () => {
    const res = mockResponse();
    const error = new Error("Something went wrong");

    handleError(res, error);

    expect(res.status).toHaveBeenCalledWith(500); // Check if status 500 was set
    expect(res.json).toHaveBeenCalledWith({
      message: "Internal Server Error",
      error: "Something went wrong",
    });
  });

  it("should respond with status 500 and a generic message if error is not an instance of Error", () => {
    const res = mockResponse();
    const error = "Some unknown error";

    handleError(res, error);

    expect(res.status).toHaveBeenCalledWith(500); // Check if status 500 was set
    expect(res.json).toHaveBeenCalledWith({
      message: "Unknown Internal Server Error",
    });
  });
});
