import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContactForm from '@/components/ContactForm';

// Mock fetch
global.fetch = jest.fn();

describe('ContactForm', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('renders contact form with all required fields', () => {
    render(<ContactForm />);

    expect(screen.getByLabelText(/your name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/your email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/your phone number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/service required/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /get free quote/i })).toBeInTheDocument();
  });

  it('shows required field indicators', () => {
    render(<ContactForm />);

    const requiredFields = screen.getAllByText('*');
    expect(requiredFields).toHaveLength(4); // name, email, phone, message
  });

  it('validates required fields on submit', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);

    const submitButton = screen.getByRole('button', { name: /get free quote/i });
    await user.click(submitButton);

    // Form should not submit with empty required fields
    expect(fetch).not.toHaveBeenCalled();
  });

  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, message: 'Thank you!' }),
    });

    render(<ContactForm />);

    // Fill in the form
    await user.type(screen.getByLabelText(/your name/i), 'John Doe');
    await user.type(screen.getByLabelText(/your email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/your phone number/i), '01234567890');
    await user.type(screen.getByLabelText(/message/i), 'I need a fire alarm installation');

    const submitButton = screen.getByRole('button', { name: /get free quote/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/send-contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'John Doe',
          email: 'john@example.com',
          phone: '01234567890',
          message: 'I need a fire alarm installation',
          service: '',
          website: '',
        }),
      });
    });
  });

  it('shows success message after successful submission', async () => {
    const user = userEvent.setup();
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, message: 'Thank you!' }),
    });

    render(<ContactForm />);

    // Fill in the form
    await user.type(screen.getByLabelText(/your name/i), 'John Doe');
    await user.type(screen.getByLabelText(/your email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/your phone number/i), '01234567890');
    await user.type(screen.getByLabelText(/message/i), 'I need a fire alarm installation');

    const submitButton = screen.getByRole('button', { name: /get free quote/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/thank you!/i)).toBeInTheDocument();
      expect(screen.getByText(/your message has been sent successfully/i)).toBeInTheDocument();
    });
  });

  it('shows error message after failed submission', async () => {
    const user = userEvent.setup();
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ success: false, error: 'Server error' }),
    });

    render(<ContactForm />);

    // Fill in the form
    await user.type(screen.getByLabelText(/your name/i), 'John Doe');
    await user.type(screen.getByLabelText(/your email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/your phone number/i), '01234567890');
    await user.type(screen.getByLabelText(/message/i), 'I need a fire alarm installation');

    const submitButton = screen.getByRole('button', { name: /get free quote/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/error sending message/i)).toBeInTheDocument();
    });
  });

  it('disables submit button while submitting', async () => {
    const user = userEvent.setup();
    fetch.mockImplementationOnce(() => new Promise((resolve) => setTimeout(resolve, 100)));

    render(<ContactForm />);

    // Fill in the form
    await user.type(screen.getByLabelText(/your name/i), 'John Doe');
    await user.type(screen.getByLabelText(/your email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/your phone number/i), '01234567890');
    await user.type(screen.getByLabelText(/message/i), 'I need a fire alarm installation');

    const submitButton = screen.getByRole('button', { name: /get free quote/i });
    await user.click(submitButton);

    expect(screen.getByRole('button', { name: /sending/i })).toBeDisabled();
  });

  it('has proper accessibility attributes', () => {
    render(<ContactForm />);

    expect(screen.getByRole('form')).toHaveAttribute(
      'aria-label',
      'Contact form for fire safety services quote'
    );
    expect(screen.getByLabelText(/your name/i)).toHaveAttribute('required');
    expect(screen.getByLabelText(/your email/i)).toHaveAttribute('required');
    expect(screen.getByLabelText(/your phone number/i)).toHaveAttribute('required');
    expect(screen.getByLabelText(/message/i)).toHaveAttribute('required');
  });

  it('includes honeypot field', () => {
    render(<ContactForm />);

    const honeypotField = screen.getByDisplayValue('');
    expect(honeypotField).toHaveAttribute('name', 'website');
    expect(honeypotField).toHaveStyle({ display: 'none' });
  });
});
