import { prisma } from '@/lib/prisma';
import { POST } from '@/app/api/auth/login/route';
import { NextRequest } from 'next/server';
import bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('POST /api/auth/login', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    (prisma.user.findUnique as jest.Mock).mockReset();
    (prisma.user.create as jest.Mock).mockReset();
  });

  it('should login a user successfully', async () => {
    const hashedPassword = await bcrypt.hash('Test123!@#', 10);
    const mockUser = {
      id: 'test-id',
      email: 'test@example.com',
      password: hashedPassword,
      name: 'Test User',
      menopauseStage: 'PERIMENOPAUSE',
      createdAt: new Date(),
    };

    (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);

    const request = new NextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'Test123!@#',
      }),
    });

    const response = await POST(request);
    const { data, message } = await response.json();

    console.log('>>>', data.user);
    expect(response.status).toBe(200);
    expect(message).toBe('Login successful');
    expect(data.user).toEqual(
      expect.objectContaining({
        email: mockUser.email,
        name: mockUser.name,
      })
    );

    expect(data.user.password).toBeUndefined();
  });

  it('should return error for non-existent user', async () => {
    prisma.user.findUnique = jest.fn().mockResolvedValueOnce(null);

    const request = new NextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'nonexistent@example.com',
        password: 'Test123!@#',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe('Invalid email or password');
  });

  it('should return error for incorrect password', async () => {
    const mockUser = {
      id: 'test-id',
      email: 'test@example.com',
      password: 'hashedPassword',
    };

    (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

    const request = new NextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'wrongPassword',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Invalid email or password');
  });
});
