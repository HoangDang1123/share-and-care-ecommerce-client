'use client'

import React, { useState } from 'react'
import { toast } from 'react-toastify';
import { forgotPassword } from '@/app/api/auth';
import ClipLoader from "react-spinners/ClipLoader";
import BackButton from '@/app/ui/back-button';

export default function Page() {
  const [formData, setFormData] = useState({
    email: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      email: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const response = await forgotPassword(formData);
      toast.success("A reset password email has been sent to your inbox. Please check your email to receive password reset instructions.");

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) { } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className='flex flex-col h-full justify-start space-y-20 py-10'
    >
      <div className='flex flex-col space-y-5'>
        <div className='flex'>
          <BackButton previousPathname='/auth/login' />
        </div>
        <div className='space-y-4'>
          <h3>Forgot Password</h3>
          <h4>Enter your email to receive password reset instructions.</h4>
        </div>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-xl font-bold text-gray-900">
              Email
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email..."
                required
                onChange={handleChange}
                autoComplete="email"
                className="block w-full rounded-lg border-0 py-1.5 pl-2 text-gray-900 sm:text-sm sm:leading-6 md:text-lg shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-gray-700"
              />
            </div>
          </div>

          <div className='space-y-5'>
            <button
              disabled={loading}
              type="submit"
              className="flex w-full h-10 justify-center items-center rounded-lg bg-gray-900 mt-10 px-3 py-1.5 text-lg font-semibold text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              {loading ? (
                <ClipLoader
                  size={20}
                  color='#ffffff'
                  aria-label="Loading Spinner"
                />
              ) : (
                'SEND'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}