import { prisma } from '@/lib/prisma';
import { POST } from '@/app/api/auth/register/route';
import { NextRequest } from 'next/server';

describe('POST /api/auth/register', () => {
  it('should register a new user successfully', async () => {
    const mockUser = {
      id: 'test-id',
      email: 'test@example.com',
      name: 'Test User',
      menopauseStage: 'PERIMENOPAUSE',
      createdAt: new Date(),
    };

    // Mock the Prisma calls
    (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(null);
    (prisma.user.create as jest.Mock).mockResolvedValueOnce(mockUser);

    const request = new NextRequest('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'Test123!@#',
        name: 'Test User',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.message).toBe('Registration successful');
    expect(data.user).toEqual(
      expect.objectContaining({
        email: mockUser.email,
        name: mockUser.name,
      })
    );
  });

  it('should return error for existing email', async () => {
    // Mock finding an existing user
    (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce({
      id: 'existing-id',
      email: 'test@example.com',
    });

    const request = new NextRequest('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'Test123!@#',
        name: 'Test User',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('User already registered');
  });

  it('should validate email format', async () => {
    const request = new NextRequest('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email: 'invalid-email',
        password: 'Test123!@#',
        name: 'Test User',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('Invalid email');
  });

  it('should validate password requirements', async () => {
    const request = new NextRequest('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'weak',
        name: 'Test User',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('Password');
  });
});
