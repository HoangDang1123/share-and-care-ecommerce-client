import { resendEmailVerification, signUpRequest } from '@/app/api/auth';
import Link from 'next/link';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

export default function SignUpForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validatePassword = () => {
    let newErrors = '';
    if (formData.password !== formData.confirmPassword) {
      newErrors = 'Passwords do not match';
    }
    setErrors(newErrors);

    const isValid = newErrors === '';
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validatePassword()) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const response = await signUpRequest({
          email: formData.email,
          username: formData.name,
          password: formData.password,
        });
        toast.success("A verification email has been sent to your inbox. Please check your email to verify your account.");

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) { }
    }
  };

  const handleResendVerification = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const response = await resendEmailVerification({
        email: formData.email,
        username: formData.name,
      });
      toast.success("A verification email has been re-sent to your inbox. Please check your email to verify your account.");

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("An error occurred during sign-up.");
    }
  }

  return (
    <div className='w-full h-full flex flex-col justify-center shadow-xl px-16'>
      <h3>Sign Up</h3>

      <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-xl font-bold text-gray-900">
              Name
            </label>
            <div className="mt-1">
              <input
                id="name"
                name="name"
                type="text"
                required
                autoComplete="name"
                value={formData.name}
                onChange={handleChange}
                className="block w-full rounded-lg border-0 py-1.5 pl-2 text-gray-900 sm:text-sm sm:leading-6 md:text-lg shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-gray-700"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-xl font-bold text-gray-900">
              Email
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                className="block w-full rounded-lg border-0 py-1.5 pl-2 text-gray-900 sm:text-sm sm:leading-6 md:text-lg shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-gray-700"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-xl font-bold text-gray-900">
              Password
            </label>
            <div className="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="block w-full rounded-lg border-0 py-1.5 pl-2 text-gray-900 sm:text-sm sm:leading-6 md:text-lg shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-gray-700"
              />
            </div>
          </div>

          <div>
            <label htmlFor="confirm-password" className="block text-xl font-bold text-gray-900">
              Confirm Password
            </label>
            <div className="mt-1">
              <input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="block w-full rounded-lg border-0 py-1.5 pl-2 text-gray-900 sm:text-sm sm:leading-6 md:text-lg shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-gray-700"
              />
              {errors && <p className="text-red-500 text-sm">{errors}</p>}
            </div>

            <div className='flex w-full justify-end'>
              <button
                onClick={handleResendVerification}
                className="font-bold underline text-gray-900 hover:text-gray-700">
                Resend email verification
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-lg bg-gray-900 mt-10 px-3 py-1.5 text-lg font-semibold text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              SIGN UP
            </button>
          </div>
        </form>

        <p className="mt-10 text-left text-md text-gray-500">
          Already have an account? {' '}
          <Link href="/auth/login" className="font-bold underline text-gray-900 hover:text-gray-700">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}