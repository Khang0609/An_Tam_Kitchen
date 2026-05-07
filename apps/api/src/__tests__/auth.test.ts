import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../index';
import mockData from './mockUserData.json';

describe('Auth Testbench', () => {
  let cookies: string[] = [];

  it('1. Should fail to sign up with invalid data', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send(mockData.invalidUser);

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation failed');
  });

  it('2. Should successfully create a new account', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send(mockData.validUser);

    // If it already exists from a previous test run, it's 400. We accept 201 or 400.
    expect([201, 400]).toContain(res.status);
    if (res.status === 201) {
      expect(res.body.message).toBe('User created successfully');
      expect(res.body.userId).toBeDefined();
    }
  });

  it('3. Should successfully sign in and receive cookies', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: mockData.validUser.email,
        password: mockData.validUser.password,
      });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Login successful');

    // Extract cookies for the next request
    const setCookieHeader = res.headers['set-cookie'] as unknown as string[];
    expect(setCookieHeader).toBeDefined();
    expect(setCookieHeader.length).toBeGreaterThanOrEqual(2); // accessToken and refreshToken
    
    cookies = setCookieHeader.map((cookie: string) => cookie.split(';')[0]);
  });

  it('4. Should successfully log out and clear cookies', async () => {
    const req = request(app).post('/api/auth/logout');
    
    // Attach cookies
    req.set('Cookie', cookies.join('; '));
    
    const res = await req.send();

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Logged out successfully');

    // Verify cookies are cleared
    const setCookieHeader = res.headers['set-cookie'] as unknown as string[];
    expect(setCookieHeader).toBeDefined();
    expect(setCookieHeader[0]).toMatch(/accessToken=;/);
    expect(setCookieHeader[1]).toMatch(/refreshToken=;/);
  });
});
