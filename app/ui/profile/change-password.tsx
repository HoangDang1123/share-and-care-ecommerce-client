'use client';

import { Password } from '@/interface/user';
import React, { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { changePassword } from '@/app/api/user';
import ClipLoader from 'react-spinners/ClipLoader';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

interface ChangePasswordProps {
  userId: string;
  accessToken: string;
}

export const ChangePassword: React.FC<ChangePasswordProps> = ({ userId, accessToken }) => {
  const [displayOldPassword, setDisplayOldPassword] = useState<'password' | 'text'>('password');
  const [displayNewPassword, setDisplayNewPassword] = useState<'password' | 'text'>('password');
  const [password, setPassword] = useState<Password>({
    oldPassword: '',
    newPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPassword(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      await changePassword(password, userId, accessToken);
      setLoading(false);

      router.refresh();
      toast.success("Change password successful!");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) { }
    finally {
      setLoading(false)
    }
  };

  return (
    <div className="flex flex-col items-center w-full gap-2 rounded-md px-3 py-1">
      <span className="font-semibold text-lg">Change Password</span>

      <div className="relative w-80">
        <input
          type={displayOldPassword}
          name="oldPassword"
          placeholder="Enter current password"
          value={password.oldPassword}
          onChange={handleChange}
          className="border border-gray-300 rounded-md w-full text-base px-3 py-1 pr-10 focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
        <button
          type="button"
          className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          onClick={() =>
            setDisplayOldPassword(prev => (prev === 'password' ? 'text' : 'password'))
          }
        >
          {displayOldPassword === 'password' ? (
            <EyeIcon className="w-5 h-5" />
          ) : (
            <EyeSlashIcon className="w-5 h-5" />
          )}
        </button>
      </div>

      <div className="relative w-80">
        <input
          type={displayNewPassword}
          name="newPassword"
          placeholder="Enter new password"
          value={password.newPassword}
          onChange={handleChange}
          className="border border-gray-300 rounded-md w-full text-base px-3 py-1 pr-10 focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
        <button
          type="button"
          className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          onClick={() =>
            setDisplayNewPassword(prev => (prev === 'password' ? 'text' : 'password'))
          }
        >
          {displayNewPassword === 'password' ? (
            <EyeIcon className="w-5 h-5" />
          ) : (
            <EyeSlashIcon className="w-5 h-5" />
          )}
        </button>
      </div>

      <button
        onClick={handleSubmit}
        className="bg-gray-800 text-white font-semibold rounded-md w-80 mt-4 text-base px-3 py-1 hover:bg-gray-900"
      >
        {loading ? (
          <ClipLoader
            size={20}
            color='#ffffff'
            aria-label="Loading Spinner"
          />
        ) : (
          'Change'
        )}
      </button>
    </div>
  );
};
