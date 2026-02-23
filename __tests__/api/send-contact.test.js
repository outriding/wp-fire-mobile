import { POST } from '@/app/api/send-contact/route';
import { NextRequest } from 'next/server';

// Mock SendGrid
jest.mock('@sendgrid/mail', () => ({
  setApiKey: jest.fn(),
  send: jest.fn(),
}));

const mockSendGrid = require('@sendgrid/mail');

describe('/api/send-contact', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.SENDGRID_API_KEY = 'test-key';
    process.env.FROM_EMAIL = 'test@example.com';
    process.env.TO_EMAIL = 'admin@example.com';
  });

  it('validates required fields', async () => {
    const request = new NextRequest('http://localhost:3000/api/send-contact', {
      method: 'POST',
      body: JSON.stringify({
        name: '',
        email: 'invalid-email',
        phone: '',
        message: '',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.details).toContain('Name is required and must be at least 2 characters');
    expect(data.details).toContain('Valid email address is required');
  });

  it('rejects spam with honeypot field', async () => {
    const request = new NextRequest('http://localhost:3000/api/send-contact', {
      method: 'POST',
      body: JSON.stringify({
        name: 'John Doe',
        email: 'john@example.com',
        phone: '01234567890',
        message: 'Valid message',
        website: 'spam-site.com', // Honeypot field filled
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.details).toContain('Spam detected');
  });

  it('rejects suspicious content', async () => {
    const request = new NextRequest('http://localhost:3000/api/send-contact', {
      method: 'POST',
      body: JSON.stringify({
        name: 'John Doe',
        email: 'john@example.com',
        phone: '01234567890',
        message: 'Check out this website: http://spam.com',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.details).toContain('Suspicious content detected');
  });

  it('sends email successfully with valid data', async () => {
    mockSendGrid.send.mockResolvedValueOnce({});

    const request = new NextRequest('http://localhost:3000/api/send-contact', {
      method: 'POST',
      body: JSON.stringify({
        name: 'John Doe',
        email: 'john@example.com',
        phone: '01234567890',
        message: 'I need a fire alarm installation',
        service: 'fire-alarm-installation',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(mockSendGrid.send).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'admin@example.com',
        from: 'test@example.com',
        replyTo: 'john@example.com',
        subject: expect.stringContaining('fire-alarm-installation'),
      })
    );
  });

  it('handles SendGrid errors gracefully', async () => {
    mockSendGrid.send.mockRejectedValueOnce(new Error('SendGrid error'));

    const request = new NextRequest('http://localhost:3000/api/send-contact', {
      method: 'POST',
      body: JSON.stringify({
        name: 'John Doe',
        email: 'john@example.com',
        phone: '01234567890',
        message: 'I need a fire alarm installation',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe('Failed to send message. Please try again or call us directly.');
  });

  it('includes proper email content', async () => {
    mockSendGrid.send.mockResolvedValueOnce({});

    const request = new NextRequest('http://localhost:3000/api/send-contact', {
      method: 'POST',
      body: JSON.stringify({
        name: 'John Doe',
        email: 'john@example.com',
        phone: '01234567890',
        message: 'I need a fire alarm installation',
        service: 'fire-alarm-installation',
        company: 'Test Company',
      }),
    });

    await POST(request);

    expect(mockSendGrid.send).toHaveBeenCalledWith(
      expect.objectContaining({
        text: expect.stringContaining('John Doe'),
        text: expect.stringContaining('john@example.com'),
        text: expect.stringContaining('01234567890'),
        text: expect.stringContaining('fire-alarm-installation'),
        text: expect.stringContaining('Test Company'),
        html: expect.stringContaining('John Doe'),
        html: expect.stringContaining('john@example.com'),
      })
    );
  });
});
