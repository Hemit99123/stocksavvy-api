import request from 'supertest';
import app from '../src/server.js'; // Assuming the path to the app file is correct

describe("POST /auth/login", () => {
  describe("given an email and password", () => {

    test("should respond with a 200 status code on successful login", async () => {
      const response = await request(app).post("/auth/login").send({
        email: "user@dailysat.com",
        password: "supersecretpassword123"
      });
      expect(response.statusCode).toBe(200);
    });

    test("should respond with a 401 status code for invalid credentials", async () => {
      const response = await request(app).post("/auth/login").send({
        email: "user@dailysat.com",
        password: "wrongpassword"
      });
      expect(response.statusCode).toBe(401);
      expect(response.body.error).toBe("invalid-credentials");
    });

    test("should specify json in the content type header", async () => {
      const response = await request(app).post("/auth/login").send({
        email: "user@dailysat.com",
        password: "supersecretpassword123"
      });
      expect(response.headers['content-type']).toEqual(expect.stringContaining("json"));
    });
  });
});

describe("POST /auth/logout", () => {
  test("should respond with a 200 status code if logged out successfully", async () => {
    const response = await request(app).post("/auth/logout");
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Logged user out and killed session from express-session and redis");
  });

  test("should respond with a 500 status code if no user is logged in", async () => {
    const response = await request(app).post("/auth/logout");
    expect(response.statusCode).toBe(500);
    expect(response.body.error).toBe("no-session-id");
  });
});

describe("POST /auth/delete", () => {
  test("should respond with a 200 status code if the user is deleted successfully", async () => {
    const response = await request(app).post("/auth/delete").send({
      email: "user@dailysat.com"
    });
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("User deleted successfully");
  });

  test("should respond with a 401 status code if the user does not have access", async () => {
    const response = await request(app).post("/auth/delete").send({
      email: "user@dailysat.com"
    });
    expect(response.statusCode).toBe(401);
    expect(response.body.error).toBe("no-auth-access");
  });
});

describe("GET /auth/check-session", () => {
  test("should respond with a 200 status code if the user is authenticated", async () => {
    const response = await request(app).get("/auth/check-session");
    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
  });

  test("should respond with a 401 status code if the user is not authenticated", async () => {
    const response = await request(app).get("/auth/check-session");
    expect(response.statusCode).toBe(401);
    expect(response.body.success).toBe(false);
  });
});
