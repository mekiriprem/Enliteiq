import React, { useState } from 'react';

export default function ResetPasswordForm() {
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    agree: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add validation and submit logic
    console.log('Form submitted:', form);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-2">Reset your password</h2>
        <p className="text-sm text-gray-500 mb-6">
          Your new password must be different from previous used passwords.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            required
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-3 border rounded-md"
          />
          <input
            type="password"
            name="password"
            required
            placeholder="New Password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-3 border rounded-md"
          />
          <input
            type="password"
            name="confirmPassword"
            required
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full p-3 border rounded-md"
          />
          <div className="flex items-center text-sm">
            <input
              type="checkbox"
              name="agree"
              checked={form.agree}
              onChange={handleChange}
              className="mr-2"
            />
            <label>
              I agree to Flowbite's{' '}
              <a href="#" className="text-blue-600 underline">
                Terms of Use
              </a>{' '}
              and{' '}
              <a href="#" className="text-blue-600 underline">
                Privacy Policy
              </a>
              .
            </label>
          </div>
          <button
            type="submit"
            disabled={!form.agree}
            className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition"
          >
            Reset password
          </button>
        </form>
      </div>
    </div>
  );
}




