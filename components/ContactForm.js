'use client';

import React, { useEffect, useRef, useState } from 'react';

export default function Contact() {
  const mapRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errors, setErrors] = useState({});

  // useEffect(() => {
  //   if (mapRef.current) {
  //     mapRef.current.innerText =
  //       "Map placeholder (initialize Google Maps here with your API key)";
  //   }
  // }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setErrors({});

    const formElement = e.currentTarget; // Store reference before async operation
    const form = new FormData(formElement);
    const data = Object.fromEntries(form.entries());

    try {
      const response = await fetch('https://formspree.io/f/xovkzkpn', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok && result.ok) {
        // Formspree uses { ok: true } for success
        setSubmitStatus('success');
        formElement.reset(); // Use stored reference
      } else {
        setSubmitStatus('error');
        if (result.errors) {
          // Map Formspree errors (array of { field, message })
          const errorMap = result.errors.reduce((acc, err) => {
            acc[err.field] = err.message;
            return acc;
          }, {});
          setErrors(errorMap);
        } else {
          setErrors({ general: result.error || 'Failed to send message' });
        }
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
      setErrors({
        general: 'Network error. Please try again or call us directly.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section
      id="contact-section"
      className="p-6 sm:p-8 md:p-12 lg:p-16 xl:p-20 bg-gray-100 min-h-[100vh] flex flex-col justify-center items-center"
    >
      {/* Header */}
      <h2 className="text-2xl sm:text-3xl md:text-4xl mb-4 sm:mb-6 md:mb-8 text-center text-red-600 font-extralight">
        Get Your Free Fire Safety Quote Today
      </h2>
      <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
        Ready to protect your property? Our BAFE-certified team provides free site surveys and
        detailed quotes for all fire safety installations. Call now or complete the form below.
      </p>
      {/* Main container */}
      <div className="flex flex-col lg:flex-row justify-center items-center w-full max-w-6xl py-4 sm:py-6 md:py-8 gap-6 sm:gap-8">
        {/* Map */}
        {/* <div id="contact-map" ref={mapRef} className="w-[40vw] h-[25vh] border border-gray-300 rounded-md overflow-hidden self-center text-center text-sm flex items-center justify-center" ></div> */}
        {/* Contact Form */}
        <div className="flex flex-col w-full lg:w-1/2 items-center">
          <form
            onSubmit={handleSubmit}
            className="text-gray-800 w-full max-w-md sm:max-w-lg text-sm sm:text-base"
            aria-label="Contact form for fire safety services quote"
            noValidate
          >
            <p className="italic text-gray-500 mb-3 sm:mb-4 text-xs sm:text-sm">
              Fields marked with an <span className="text-red-600">*</span> are required. We&apos;ll
              respond within 2 hours during business hours.
            </p>

            {/* Success/Error Messages */}
            {submitStatus === 'success' && (
              <div
                className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md"
                role="alert"
              >
                <p className="font-semibold">Thank you!</p>
                <p>
                  Your message has been sent successfully. We&apos;ll respond within 2 hours during
                  business hours.
                </p>
              </div>
            )}

            {submitStatus === 'error' && (
              <div
                className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md"
                role="alert"
              >
                <p className="font-semibold">Error sending message</p>
                <p>
                  {errors.general ||
                    Object.values(errors).join(', ') ||
                    'Please try again or call us directly at 0333 880 2993.'}
                </p>
              </div>
            )}

            {/* Honeypot field - Changed to Formspree's default name */}
            <input
              type="text"
              name="_gotcha"
              style={{ display: 'none' }}
              tabIndex={-1}
              autoComplete="off"
            />
            {/* Hidden subject field to fix 422 validation */}
            <input type="hidden" name="_subject" value="New submission from WP Fire Contact Form" />
            {/* Row 1 */}
            <div className="flex flex-col sm:flex-row justify-between mb-3 sm:mb-4 gap-2 sm:gap-3">
              <div className="flex-1">
                <label htmlFor="name" className="block text-sm sm:text-base">
                  Your Name:<span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  aria-describedby="name-error"
                  className="w-full p-2 sm:p-3 text-sm sm:text-base mt-1 border border-gray-300 rounded-sm bg-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                <div id="name-error" className="sr-only" role="alert" aria-live="polite"></div>
              </div>
              <div className="flex-1">
                <label htmlFor="service" className="block text-sm sm:text-base">
                  Service Required:
                </label>
                <select
                  id="service"
                  name="service"
                  className="w-full p-2 sm:p-3 text-sm sm:text-base mt-1 border border-gray-300 rounded-sm bg-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">Select a service</option>
                  <option value="fire-alarm-installation">Fire Alarm Installation</option>
                  <option value="fire-alarm-maintenance">Fire Alarm Maintenance</option>
                  <option value="emergency-lighting">Emergency Lighting</option>
                  <option value="fire-risk-assessment">Fire Risk Assessment</option>
                  <option value="security-systems">Security Systems</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            {/* Row 2 */}
            <div className="flex flex-col sm:flex-row justify-between mb-3 sm:mb-4 gap-2 sm:gap-3">
              <div className="flex-1">
                <label htmlFor="email" className="block text-sm sm:text-base">
                  Your Email:<span className="text-red-600">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  aria-describedby="email-error"
                  className="w-full p-2 sm:p-3 text-sm sm:text-base mt-1 border border-gray-300 rounded-sm bg-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                <div id="email-error" className="sr-only" role="alert" aria-live="polite"></div>
              </div>
              <div className="flex-1">
                <label htmlFor="phone" className="block text-sm sm:text-base">
                  Your Phone Number:<span className="text-red-600">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  aria-describedby="phone-error"
                  className="w-full p-2 sm:p-3 text-sm sm:text-base mt-1 border border-gray-300 rounded-sm bg-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                <div id="phone-error" className="sr-only" role="alert" aria-live="polite"></div>
              </div>
            </div>
            {/* Message */}
            <div className="mb-3 sm:mb-4">
              <label htmlFor="message" className="block text-sm sm:text-base">
                Message:<span className="text-red-600">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                required
                aria-describedby="message-error"
                className="w-full p-2 sm:p-3 text-sm sm:text-base mt-1 border border-gray-300 rounded-sm h-24 sm:h-28 bg-white focus:ring-2 focus:ring-red-500 focus:border-transparent resize-vertical"
              ></textarea>
              <div id="message-error" className="sr-only" role="alert" aria-live="polite"></div>
            </div>
            {/* Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base text-white bg-red-600 rounded-sm hover:bg-red-700 transition-colors duration-200 self-start mt-1 w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-describedby="submit-status"
            >
              {isSubmitting ? 'Sending...' : 'Get Free Quote'}
            </button>
            <div id="submit-status" className="sr-only" aria-live="polite">
              {isSubmitting
                ? 'Sending your message...'
                : submitStatus === 'success'
                  ? 'Message sent successfully'
                  : submitStatus === 'error'
                    ? 'Failed to send message'
                    : ''}
            </div>
          </form>
        </div>
        {/* Contact Info & Testimonials */}
        <div className="flex justify-center w-full lg:w-1/2">
          <div className="flex flex-col gap-6 sm:gap-8 md:gap-10 text-gray-800 w-full max-w-sm sm:max-w-md text-sm sm:text-base items-start">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-light">Contact Information</h3>
            <div className="space-y-4">
              <div>
                <p className="text-base sm:text-lg font-semibold text-red-600">
                  Call Now: 0333 880 2993
                </p>
                <p className="text-sm text-gray-600">24/7 Emergency Service</p>
              </div>
              <div>
                <p className="text-base sm:text-lg font-semibold text-red-600">info@wpfire.co.uk</p>
                <p className="text-sm text-gray-600">Response within 2 hours</p>
              </div>
              <div>
                <p className="text-base sm:text-lg font-light">
                  8 The Lindens, Stock, <br /> Ingatestone, CM4 9NH
                </p>
                <p className="text-sm text-gray-600">Serving London & South East</p>
              </div>
            </div>

            {/* Testimonials */}
            <div className="mt-8">
              <h4 className="text-lg font-semibold mb-4">What Our Clients Say</h4>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-sm italic mb-2">
                    &quot;WP Fire installed our fire alarm system quickly and professionally. Their
                    BAFE certification gave us confidence in their expertise.&quot;
                  </p>
                  <p className="text-xs text-gray-600">- Sarah M., Property Manager</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-sm italic mb-2">
                    &quot;Excellent service from start to finish. The team was knowledgeable,
                    punctual, and the system works perfectly.&quot;
                  </p>
                  <p className="text-xs text-gray-600">- James R., Business Owner</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
