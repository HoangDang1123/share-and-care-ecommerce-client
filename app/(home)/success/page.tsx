'use client'

import { CheckCircleIcon } from '@heroicons/react/20/solid';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function VerificationSuccess() {
  const [countdown, setCountdown] = useState(3);
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          router.push('/auth/login');
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  const handleRedirect = () => {
    router.push('/auth/login');
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-10 text-center">
        <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Verification Successful!</h1>
        <p className="text-gray-700 mb-4">Thank you for verifying your email address.</p>
        <p className="text-gray-600 mb-4">
          You will be redirected to the login page in {countdown} seconds.
        </p>
        <button
          onClick={handleRedirect}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
        >
          Go to Login Now
        </button>
      </div>
    </div>
  );
}