'use client'

import { resendEmailVerification, signUpRequest } from '@/app/api/auth';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import ClipLoader from 'react-spinners/ClipLoader';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

export default function Page() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState('');
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setIsClient(true)
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validatePassword = () => {
    let newErrors = '';
    if (formData.password !== formData.confirmPassword) {
      newErrors = 'Mật khẩu không khớp';
    }
    setErrors(newErrors);

    const isValid = newErrors === '';
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validatePassword()) {
      setLoading(true);
      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const response = await signUpRequest({
          email: formData.email,
          username: formData.name,
          password: formData.password,
        });
        toast.success("Một email xác minh đã được gửi đến hộp thư của bạn. Vui lòng kiểm tra email để xác minh tài khoản.");

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) { }
      finally {
        setLoading(false);
      }
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
      toast.success("Một email xác minh đã được gửi đến hộp thư của bạn. Vui lòng kiểm tra email để xác minh tài khoản.");

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Đã có lỗi xảy ra trong quá trình đăng ký.");
    }
  }

  return (
    <>
      {isClient && (
        <div
          className='flex flex-col justify-center'
        >
          <span className='text-5xl font-bold'>Đăng ký</span>

          <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-xl font-semibold text-gray-900">
                  Họ và tên
                </label>
                <div className="mt-1">
                  <input
                    id="name"
                    name="name"
                    placeholder="Nhập họ và tên..."
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
                <label htmlFor="email" className="block text-xl font-semibold text-gray-900">
                  Email
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    placeholder="Nhập email..."
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
                <label htmlFor="password" className="block text-xl font-semibold text-gray-900">
                  Mật khẩu
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    placeholder="Nhập mật khẩu..."
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
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
              </div>

              <div>
                <label htmlFor="confirm-password" className="block text-xl font-semibold text-gray-900">
                  Nhập lại mật khẩu
                </label>
                <div className="mt-1 relative">
                  <input
                    id="confirm-password"
                    name="confirmPassword"
                    placeholder="Nhập lại mật khẩu..."
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="block w-full rounded-lg border-0 py-1.5 pl-2 pr-10 text-gray-900 sm:text-sm sm:leading-6 md:text-lg shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-gray-700"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(prev => !prev)}
                    className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>

                  {errors && <p className="text-red-500 text-sm mt-1">{errors}</p>}
                </div>

                <div className="flex w-full justify-end mt-2">
                  <button
                    onClick={handleResendVerification}
                    className="font-semibold underline text-gray-900 hover:text-gray-700"
                  >
                    Gửi lại xác thực email
                  </button>
                </div>
              </div>

              <div>
                <button
                  disabled={loading}
                  type="submit"
                  className="flex items-center w-full h-10 justify-center rounded-lg bg-gray-900 mt-10 px-3 py-1.5 text-lg font-semibold text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  {loading ? (
                    <ClipLoader
                      size={20}
                      color='#ffffff'
                      aria-label="Loading Spinner"
                    />
                  ) : (
                    'ĐĂNG KÝ'
                  )}
                </button>
              </div>
            </form>

            <p className="mt-10 text-left text-md text-gray-500">
              Bạn đã có tài khoản? {' '}
              <button
                type="button"
                onClick={() => router.push('/auth/login')}
                className="font-bold underline text-gray-900 hover:text-gray-700"
              >
                Đăng nhập ngay
              </button>
            </p>
          </div>
        </div>
      )}
    </>
  );
}