import Link from 'next/link'
import React from 'react'

export default function SignUpForm() {
    return (
        <div className='w-full h-full flex flex-col justify-center shadow-xl px-16'>
            <h3>Sign Up</h3>

            <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
                <form action="#" method="POST" className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-xl font-bold text-gray-900">
                            Name
                        </label>
                        <div className="mt-1">
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                autoComplete="name"
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
                                className="block w-full rounded-lg border-0 py-1.5 pl-2 text-gray-900 sm:text-sm sm:leading-6 md:text-lg shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-gray-700"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-xl font-bold text-gray-900">
                            Confirm password
                        </label>
                        <div className="mt-1">
                            <input
                                id="confirm-password"
                                name="confirm-password"
                                type="password"
                                required
                                className="block w-full rounded-lg border-0 py-1.5 pl-2 text-gray-900 sm:text-sm sm:leading-6 md:text-lg shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-gray-700"
                            />
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
                    Already have an account ? {' '}
                    <Link href="/login" className="font-bold underline text-gray-900 hover:text-gray-700">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    )
}
