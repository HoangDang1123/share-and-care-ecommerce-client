'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react'

export default function Page() {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const id = params.get('orderId');
  const router = useRouter()

  return (
    <div className="flex flex-col items-center justify-center h-[80vh] text-center px-4 space-y-6">
      <div className="text-red-600 text-4xl">❌</div>
      <h1 className="text-2xl font-bold text-gray-800">Payment failure</h1>
      <p className="text-gray-600 max-w-md">
        The payment for order{" "}
        <button
          onClick={() => router.push(`/order/${id}`)}
          className="text-blue-600 underline hover:text-blue-800 font-semibold"
        >
          {id}
        </button>{" "}
        could not be processed. Please try again or contact support for assistance.
      </p>
      <div className="flex space-x-4 mt-4">
        <Link href="/" className="bg-gray-200 px-4 py-2 font-medium rounded hover:bg-gray-300">
          Back to Home
        </Link>
      </div>
    </div>
  )
}
