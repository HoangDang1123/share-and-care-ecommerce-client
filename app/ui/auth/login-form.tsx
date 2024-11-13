import Link from 'next/link'
import React from 'react'
import Image from 'next/image';

type LoginHandler = () => void;

interface LoginFormProps {
  onLogin: LoginHandler;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const handleLogin = (e: React.FormEvent<EventTarget>): void => {
    e.preventDefault();
    onLogin();
  }

  return (
    <div className='w-full h-full flex flex-col justify-center shadow-xl px-16'>
      <h3>Login</h3>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form action="submit" method="POST" className="space-y-5">
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
                placeholder="Enter your password..."
                required
                autoComplete="current-password"
                className="block w-full rounded-lg border-0 py-1.5 pl-2 text-gray-900 sm:text-sm sm:leading-6 md:text-lg shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-gray-700"
              />
            </div>
            <div className='flex w-full justify-end'>
              <Link href="#" className="font-bold underline text-gray-900 hover:text-gray-700">
                Forgot password?
              </Link>
            </div>
          </div>

          <div className='space-y-5'>
            <button
              type="submit"
              className="flex w-full justify-center rounded-lg bg-gray-900 px-3 py-1.5 text-lg font-semibold text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              LOGIN
            </button>

            <div className='flex justify-center items-center space-x-4 px-10'>
              <hr className='w-full h-0.5 bg-gray-900' />
              <h4>OR</h4>
              <hr className='w-full h-0.5 bg-gray-900' />
            </div>

            <button
              className="flex w-full justify-center items-center rounded-lg border-gray-400 border font-semibold bg-white px-3 py-1.5 text-lg text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              onClick={handleLogin}
            >
              <Image
                alt="Google Logo"
                src="/assets/google-logo.png"
                width={30}
                height={30}
                className="w-auto h-auto mr-2"
              />
              Sign in with Google
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-md text-gray-500">
          Doesn&apos;t have any account yet ? {' '}
          <Link href="/sign-up" className="font-bold underline text-gray-900 hover:text-gray-700">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  )
}

export default LoginForm;