import { NextRequest, NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map();

// Rate limiting function
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 5; // Max 5 requests per 15 minutes

  if (!rateLimitStore.has(ip)) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  const record = rateLimitStore.get(ip);

  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + windowMs;
    return true;
  }

  if (record.count >= maxRequests) {
    return false;
  }

  record.count++;
  return true;
}

// Input validation
function validateInput(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Required fields
  if (!data.name || typeof data.name !== 'string' || data.name.trim().length < 2) {
    errors.push('Name is required and must be at least 2 characters');
  }

  if (
    !data.email ||
    typeof data.email !== 'string' ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)
  ) {
    errors.push('Valid email address is required');
  }

  if (!data.phone || typeof data.phone !== 'string' || data.phone.trim().length < 10) {
    errors.push('Phone number is required and must be at least 10 characters');
  }

  if (!data.message || typeof data.message !== 'string' || data.message.trim().length < 10) {
    errors.push('Message is required and must be at least 10 characters');
  }

  // Honeypot field (should be empty)
  if (data.website && data.website.trim() !== '') {
    errors.push('Spam detected');
  }

  // Check for suspicious content
  const suspiciousPatterns = [/http[s]?:\/\//gi, /www\./gi, /\.com/gi, /bit\.ly/gi, /tinyurl/gi];

  const textToCheck = `${data.name} ${data.message}`;
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(textToCheck)) {
      errors.push('Suspicious content detected');
      break;
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip =
      request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';

    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Too many requests. Please try again later.',
        },
        { status: 429 }
      );
    }

    // Parse request body
    const data = await request.json();

    // Validate input
    const validation = validateInput(data);
    if (!validation.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid input',
          details: validation.errors,
        },
        { status: 400 }
      );
    }

    // Prepare email content
    const emailContent = {
      to: process.env.TO_EMAIL || 'info@wpfire.co.uk',
      from: process.env.FROM_EMAIL || 'noreply@wpfire.co.uk',
      replyTo: data.email,
      subject: `New Contact Form Submission - ${data.service || 'General Enquiry'}`,
      text: `
New contact form submission from WP Fire website:

Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone}
Service: ${data.service || 'Not specified'}
Company: ${data.company || 'Not specified'}

Message:
${data.message}

---
Submitted at: ${new Date().toISOString()}
IP Address: ${ip}
      `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #e53935;">New Contact Form Submission</h2>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px;">
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
            <p><strong>Phone:</strong> <a href="tel:${data.phone}">${data.phone}</a></p>
            <p><strong>Service:</strong> ${data.service || 'Not specified'}</p>
            <p><strong>Company:</strong> ${data.company || 'Not specified'}</p>
          </div>
          <div style="margin-top: 20px;">
            <h3>Message:</h3>
            <p style="background-color: #fff; padding: 15px; border-left: 4px solid #e53935;">
              ${data.message.replace(/\n/g, '<br>')}
            </p>
          </div>
          <div style="margin-top: 20px; font-size: 12px; color: #666;">
            <p>Submitted at: ${new Date().toLocaleString('en-GB')}</p>
            <p>IP Address: ${ip}</p>
          </div>
        </div>
      `,
    };

    // Send email
    await sgMail.send(emailContent);

    // Send auto-reply to customer (optional)
    if (process.env.SEND_AUTO_REPLY === 'true') {
      const autoReplyContent = {
        to: data.email,
        from: process.env.FROM_EMAIL || 'noreply@wpfire.co.uk',
        subject: "Thank you for contacting WP Fire - We'll be in touch soon",
        text: `
Dear ${data.name},

Thank you for contacting WP Fire regarding ${data.service || 'your fire safety requirements'}.

We have received your message and will respond within 2 hours during business hours (Monday-Friday, 8am-6pm).

If this is an emergency, please call us immediately on 0333 880 2993.

Best regards,
The WP Fire Team

---
WP Fire
Professional Fire Safety Services
Phone: 0333 880 2993
Email: info@wpfire.co.uk
Website: https://wpfire.co.uk
        `,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #e53935; color: white; padding: 20px; text-align: center;">
              <h1 style="margin: 0;">WP Fire</h1>
              <p style="margin: 5px 0 0 0;">Professional Fire Safety Services</p>
            </div>
            <div style="padding: 20px;">
              <h2 style="color: #e53935;">Thank you for contacting us!</h2>
              <p>Dear ${data.name},</p>
              <p>Thank you for contacting WP Fire regarding <strong>${data.service || 'your fire safety requirements'}</strong>.</p>
              <p>We have received your message and will respond within <strong>2 hours</strong> during business hours (Monday-Friday, 8am-6pm).</p>
              <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p style="margin: 0; color: #856404;"><strong>Emergency?</strong> Please call us immediately on <a href="tel:03338802993" style="color: #e53935;">0333 880 2993</a></p>
              </div>
              <p>Best regards,<br>The WP Fire Team</p>
            </div>
            <div style="background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 14px;">
              <p><strong>WP Fire</strong><br>
              Professional Fire Safety Services<br>
              Phone: <a href="tel:03338802993" style="color: #e53935;">0333 880 2993</a><br>
              Email: <a href="mailto:info@wpfire.co.uk" style="color: #e53935;">info@wpfire.co.uk</a><br>
              Website: <a href="https://wpfire.co.uk" style="color: #e53935;">wpfire.co.uk</a></p>
            </div>
          </div>
        `,
      };

      try {
        await sgMail.send(autoReplyContent);
      } catch (autoReplyError) {
        console.error('Auto-reply failed:', autoReplyError);
        // Don't fail the main request if auto-reply fails
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you for your message. We will respond within 2 hours during business hours.',
    });
  } catch (error) {
    console.error('Contact form error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to send message. Please try again or call us directly.',
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
