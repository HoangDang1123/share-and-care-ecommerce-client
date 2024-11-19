import React from 'react';

export default function DeliveryForm() {
  return (
    <div className="flex flex-col w-[1040px] space-y-4 mx-auto px-16 py-10 rounded-xl shadow-lg">
      <h1 className="mb-6">Delivery Information</h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-6">

        <div className="sm:col-span-6">
          <label htmlFor="full-name" className="block text-lg font-semibold text-gray-700 mb-1">
            Full Name
          </label>
          <input
            id="full-name"
            name="full-name"
            type="text"
            autoComplete="given-name"
            className="block w-full rounded-xl border border-gray-300 py-2 px-3 text-md text-gray-900 shadow-sm placeholder:text-gray-400"
            placeholder="Enter your full name"
          />
        </div>

        <div className="sm:col-span-4">
          <label htmlFor="email" className="block text-lg font-semibold text-gray-700 mb-1">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            className="block w-full rounded-xl border border-gray-300 py-2 px-3 text-md text-gray-900 shadow-sm placeholder:text-gray-400"
            placeholder="Enter your email"
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="phone" className="block text-lg font-semibold text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            id="phone"
            name="phone"
            type="text"
            autoComplete="tel"
            className="block w-full rounded-xl border border-gray-300 py-2 px-3 text-md text-gray-900 shadow-sm placeholder:text-gray-400"
            placeholder="Enter your phone number"
          />
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="city" className="block text-lg font-semibold text-gray-700 mb-1">
            City
          </label>
          <input
            id="city"
            name="city"
            type="text"
            autoComplete="city"
            className="block w-full rounded-xl border border-gray-300 py-2 px-3 text-md text-gray-900 shadow-sm placeholder:text-gray-400"
            placeholder="Enter your city"
          />
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="region" className="block text-lg font-semibold text-gray-700 mb-1">
            Province
          </label>
          <input
            id="region"
            name="region"
            type="text"
            autoComplete="region"
            className="block w-full rounded-xl border border-gray-300 py-2 px-3 text-md text-gray-900 shadow-sm placeholder:text-gray-400"
            placeholder="Enter your state or province"
          />
        </div>

        <div className="col-span-full">
          <label htmlFor="street-address" className="block text-lg font-semibold text-gray-700 mb-1">
            Street Address
          </label>
          <input
            id="street-address"
            name="street-address"
            type="text"
            autoComplete="street-address"
            className="block w-full rounded-xl border border-gray-300 py-2 px-3 text-md text-gray-900 shadow-sm placeholder:text-gray-400"
            placeholder="Enter your street address"
          />
        </div>
      </div>
    </div>
  );
}