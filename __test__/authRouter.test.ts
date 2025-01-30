import request from 'supertest';
import express from 'express';
import * as authController from '../src/controllers/auth.controller.js'; // Importing all named exports
import authRoutes from "../src/routes/auth.route.js";

jest.mock('../src/controllers/auth.controller.ts'); // Mocking the controller

const app = express();
app.use(express.json());
app.use('/auth', authRoutes); // Registering the routes

describe('Auth routes', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clearing mocks after each test
  });

  test('POST /auth/login - Success', async () => {
    // @ts-ignore
    (authController.login as jest.Mock).mockResolvedValue({ message: 'Login successful' });

    const response = await request(app)
      .post('/auth/login')
      .send({ email: 'user@dailysat.com', password: 'supersecretpassword123' });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Login successful');
  });

  test('POST /auth/login - Invalid credentials', async () => {
    // @ts-ignore
    (authController.login as jest.Mock).mockRejectedValue({
      message: 'Invalid email or password',
      error: 'invalid-credentials',
    });

    const response = await request(app)
      .post('/auth/login')
      .send({ email: 'invalid@dailysat.com', password: 'wrongpassword' });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Invalid email or password');
    expect(response.body.error).toBe('invalid-credentials');
  });

  test('POST /auth/logout - Success', async () => {
    // @ts-ignore
    (authController.logOut as jest.Mock).mockResolvedValue({
      message: 'Logged user out and killed session from express-session and redis',
    });

    const response = await request(app).post('/auth/logout');

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Logged user out and killed session from express-session and redis');
  });

  test('POST /auth/logout - No session', async () => {
    // @ts-ignore
    (authController.logOut as jest.Mock).mockRejectedValue({
      message: 'User is not logged in and therefore cannot be logged out',
      error: 'no-session-id',
    });

    const response = await request(app).post('/auth/logout');

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('User is not logged in and therefore cannot be logged out');
    expect(response.body.error).toBe('no-session-id');
  });

  test('GET /auth/check-session - Success', async () => {
    // @ts-ignore
    (authController.checkSession as jest.Mock).mockResolvedValue({ success: true });

    const response = await request(app).get('/auth/check-session');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  test('GET /auth/check-session - Unauthorized', async () => {
    // @ts-ignore
    (authController.checkSession as jest.Mock).mockRejectedValue({ message: 'User is NOT authenticated' });

    const response = await request(app).get('/auth/check-session');

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('User is NOT authenticated');
  });
});
