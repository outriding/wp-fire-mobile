# WP Fire - Professional Fire Safety Services Website

A modern, production-ready Next.js website for WP Fire, a professional fire alarm installation and maintenance company serving London and South East England.

## 🚀 Features

- **Professional Design**: Clean, modern UI with conversion-focused content
- **SEO Optimized**: Complete meta tags, Open Graph, Twitter Cards, and structured data
- **Accessibility**: WCAG AA compliant with proper ARIA labels and semantic HTML
- **Performance**: Optimized images, lazy loading, and efficient bundle sizes
- **Security**: CSP headers, rate limiting, and spam protection
- **Contact Form**: Secure email sending with SendGrid integration
- **Mobile-First**: Fully responsive design optimized for all devices
- **Testing**: Comprehensive test suite with Jest and React Testing Library

## 🛠️ Tech Stack

- **Framework**: Next.js 15.5.6 with App Router
- **Styling**: Tailwind CSS 4
- **Email**: SendGrid API
- **Testing**: Jest + React Testing Library
- **Deployment**: Netlify (with Vercel support)
- **Icons**: React Icons
- **Fonts**: Google Fonts (Roboto)

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- SendGrid account (for contact form)
- Netlify account (for deployment)

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd wp-fire-app
npm install
```

### 2. Environment Setup

Copy the environment example file and configure your variables:

```bash
cp env.example .env.local
```

Edit `.env.local` with your actual values:

```env
# SendGrid Configuration
SENDGRID_API_KEY=your_sendgrid_api_key_here
FROM_EMAIL=noreply@wpfire.co.uk
TO_EMAIL=info@wpfire.co.uk

# Optional: Enable auto-reply emails to customers
SEND_AUTO_REPLY=true

# Optional: Analytics
PLAUSIBLE_SITE_ID=wpfire.co.uk

# Optional: Google Search Console verification
GOOGLE_VERIFICATION_CODE=your_google_verification_code_here
```

### 3. Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### 4. Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### 5. Build for Production

```bash
npm run build
npm start
```

## 📧 Contact Form Setup

The contact form uses SendGrid for secure email delivery. Follow these steps:

### SendGrid Setup

1. **Create SendGrid Account**: Sign up at [sendgrid.com](https://sendgrid.com)
2. **Verify Sender**: Verify your domain or single sender email
3. **Create API Key**: Generate an API key with "Mail Send" permissions
4. **Configure Environment**: Add your API key to `.env.local`

### Testing the Contact Form

Test the contact form locally:

```bash
# Start the development server
npm run dev

# Test with curl (optional)
curl -X POST http://localhost:3000/api/send-contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "01234567890",
    "message": "Test message",
    "service": "fire-alarm-installation"
  }'
```

## 🚀 Deployment

### Netlify Deployment (Recommended)

1. **Connect Repository**: Link your Git repository to Netlify
2. **Configure Build Settings**:
   - Build Command: `npm run build`
   - Publish Directory: `.next`
   - Node Version: `18`
3. **Set Environment Variables**: Add all variables from `.env.local` to Netlify's environment settings
4. **Deploy**: Netlify will automatically deploy on every push to main

### Vercel Deployment (Alternative)

1. **Install Vercel CLI**: `npm i -g vercel`
2. **Login**: `vercel login`
3. **Deploy**: `vercel --prod`
4. **Configure Environment**: Add environment variables in Vercel dashboard

### Manual Deployment

```bash
# Build the application
npm run build

# The built files will be in .next/
# Upload to your hosting provider
```

## 🔧 Configuration

### SEO Configuration

Update the following files with your business information:

- `app/layout.js` - Update LocalBusiness JSON-LD schema
- `public/sitemap.xml` - Update URLs and dates
- `public/robots.txt` - Update domain name

### Content Updates

Replace placeholder content in:

- `components/Hero.js` - Main headline and CTAs
- `components/AboutSection.js` - Company information
- `components/ContactForm.js` - Contact information and testimonials
- `app/services/page.js` - Service descriptions

### Images

Replace placeholder images in `public/images/`:

- `og-image.jpg` (1200x630px) - Main Open Graph image
- `og-services.jpg` (1200x630px) - Services page OG image
- Update existing images with proper alt text

## 🧪 Testing

The project includes comprehensive tests:

- **Contact Form**: Form validation, submission, and error handling
- **API Routes**: Email sending, validation, and error handling
- **Components**: Rendering and accessibility

Run tests:

```bash
npm test                    # Run all tests
npm run test:watch         # Watch mode
npm run test:coverage      # Coverage report
```

## 🔒 Security Features

- **Rate Limiting**: 5 requests per 15 minutes per IP
- **Spam Protection**: Honeypot fields and content filtering
- **Input Validation**: Server-side validation for all form fields
- **Security Headers**: CSP, HSTS, X-Frame-Options, etc.
- **Environment Variables**: No secrets in code

## 📊 Performance Optimizations

- **Image Optimization**: Next.js Image component with WebP/AVIF support
- **Font Optimization**: Preloaded Google Fonts with display=swap
- **Code Splitting**: Automatic route-based code splitting
- **Bundle Analysis**: Optimized imports and tree shaking
- **Caching**: Proper cache headers for static assets

## ♿ Accessibility Features

- **WCAG AA Compliant**: Proper contrast ratios and focus management
- **Semantic HTML**: Proper heading structure and landmarks
- **ARIA Labels**: Screen reader friendly navigation and forms
- **Keyboard Navigation**: Full keyboard accessibility
- **Alt Text**: Descriptive alt text for all images

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🐛 Troubleshooting

### Common Issues

**Contact form not sending emails:**

- Check SendGrid API key is correct
- Verify sender email is verified in SendGrid
- Check Netlify/Vercel environment variables

**Build failures:**

- Ensure Node.js version 18+
- Clear `.next` folder and `node_modules`
- Run `npm install` again

**Images not loading:**

- Check image paths in `public/images/`
- Verify Next.js Image component usage
- Check for CORS issues

### Getting Help

- Check the [Next.js documentation](https://nextjs.org/docs)
- Review [Tailwind CSS docs](https://tailwindcss.com/docs)
- Check [SendGrid documentation](https://docs.sendgrid.com)

## 📝 License

This project is proprietary software for WP Fire. All rights reserved.

## 🤝 Contributing

This is a client project. For updates or modifications, please contact the development team.

---

**WP Fire** - Professional Fire Safety Services  
Phone: 0333 880 2993  
Email: info@wpfire.co.uk  
Website: https://wpfire.co.uk
