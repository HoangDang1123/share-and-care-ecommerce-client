'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import { toast } from 'react-toastify';
import { loginRequest } from '@/app/api/auth';
import { useRouter } from 'next/navigation';
import ClipLoader from "react-spinners/ClipLoader";
import useDeviceInfo from '@/hooks/useDeviceInfo';
import { useAuth } from '@/app/context/AppContext';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { reconnectSocket } from '@/utils/socket';
import { useSocket } from '@/app/context/SocketContext';

export default function Page() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false)
  const [showPassword, setShowPassword] = useState(false);
  const { deviceToken, deviceName, browserName } = useDeviceInfo();
  const { setIsLogin } = useAuth();
  const { setSocket } = useSocket();

  useEffect(() => {
    setIsClient(true)
  }, []);

  useEffect(() => {
    setIsLogin(false);
  }, [setIsLogin]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await loginRequest({
        email: formData.email,
        password: formData.password,
        deviceToken: deviceToken,
        deviceName: deviceName,
      });
      toast.success("Login successful.");

      setIsLogin(true);

      const currentTime = new Date().getTime();

      localStorage.setItem('accessToken', response.tokens.accessToken);
      localStorage.setItem('refreshToken', response.tokens.refreshToken);
      localStorage.setItem('userId', response.user.id);
      localStorage.setItem('tokenTimestamp', currentTime.toString());
      localStorage.setItem('isLogin', 'true');
      localStorage.setItem('avatarUrl', response.user.avatar);
      localStorage.setItem('email', response.user.email);
      localStorage.setItem('name', response.user.name);

      const socket = reconnectSocket({
        token: localStorage.getItem('accessToken') || '',
        deviceToken: localStorage.getItem('deviceToken') || '',
        role: 'user',
      });

      setSocket(socket);

      socket.on('connect', () => {
        console.log('🔄 Reconnected with user');
      });

      router.push('/');

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) { } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {isClient && (
        <div
          className='flex flex-col justify-center'
        >
          <h3>Login</h3>

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

              <div>
                <label htmlFor="password" className="block text-xl font-bold text-gray-900">
                  Password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password..."
                    required
                    onChange={handleChange}
                    autoComplete="current-password"
                    className="block w-full rounded-lg border-0 py-1.5 pl-2 pr-10 text-gray-900 sm:text-sm sm:leading-6 md:text-lg shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-gray-700"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => !prev)}
                    className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <div className='flex w-full justify-end'>
                  <button
                    type='button'
                    onClick={() => router.push('/auth/forgot-password')}
                    className="font-bold underline text-gray-900 hover:text-gray-700 hover:underline"
                  >
                    Forgot password?
                  </button>
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
                    'LOGIN'
                  )}
                </button>

                <div className='flex justify-center items-center space-x-4 px-10'>
                  <hr className='w-full h-0.5 bg-gray-900' />
                  <h4>OR</h4>
                  <hr className='w-full h-0.5 bg-gray-900' />
                </div>

                {/* Nút đăng nhập bằng Google */}
                <button
                  onClick={() => window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google?deviceToken=${deviceToken}&deviceName=${browserName}`}
                  type="button"
                  className="flex w-full justify-start items-center rounded-lg border-gray-400 border font-semibold bg-white pl-16 py-1.5 text-lg text-gray-900 shadow-sm hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
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

                {/* Nút đăng nhập bằng Facebook */}
                {/* <button
                onClick={() => window.location.href = `http://localhost:3000/api/v1/auth/facebook?deviceToken=${deviceToken}&deviceName=${browserName}`}
                type="button"
                className="flex w-full justify-start items-center rounded-lg border-gray-400 border font-semibold bg-indigo-800 pl-16 py-1.5 text-lg text-white shadow-sm hover:bg-indigo-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                <Image
                  alt="Facebook Logo"
                  src="/assets/facebook-logo.png" // Thay đổi đường dẫn logo nếu cần
                  width={30}
                  height={30}
                  className="w-auto h-auto mr-2"
                />
                Sign in with Facebook
              </button> */}
              </div>
            </form>

            <p className="mt-10 text-center text-md text-gray-500">
              Doesn&apos;t have any account yet ? {' '}
              <button
                type="button"
                onClick={() => router.push('/auth/sign-up')}
                className="font-bold underline text-gray-900 hover:text-gray-700"
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>
      )}
    </>
  )
}