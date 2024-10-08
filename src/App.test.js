import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import LoginForm from './LoginForm'; // Assuming the component is named LoginForm

describe('LoginForm Component', () => {
  it('should allow entering email/username and password, and submit the form', () => {
    const mockSubmitFunction = jest.fn(); // Mock function for form submission

    render(<LoginForm onSubmit={mockSubmitFunction} />);

    // Find input fields
    const emailInput = screen.getByPlaceholderText(/Enter your email or username/i);
    const passwordInput = screen.getByPlaceholderText(/Enter a Password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });

    // Simulate user typing email and password
    fireEvent.change(emailInput, { target: { value: 'test.student@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    // Simulate form submission by clicking the login button
    fireEvent.click(loginButton);

    // Check if the mock submit function was called with the correct credentials
    expect(mockSubmitFunction).toHaveBeenCalledWith({
      email: 'test.student@edxample.com',
      password: 'password123',
    });
  });
});
