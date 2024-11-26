'use client'

import Image from 'next/image'
import React, { useState } from 'react'
import LoginForm from '../ui/auth/login-form';
import SignUpForm from '../ui/auth/signUp-form';

export default function Page() {
  const [form, setForm] = useState('login');

  return (
    <div
      style={{ height: `calc(100vh - 200px)` }}
      className='flex justify-center items-center space-x-20 px-20 py-10 bg-gray-50'
    >
      <Image
        alt="Login Thumb"
        src="/assets/Auth-thumb.png"
        priority
        width={1920}
        height={1080}
        style={{ width: "auto", height: "auto" }}
      />

      <div className='w-[500px] h-full flex flex-col justify-center shadow-xl px-16 ease-in-out duration-300'>
        {form === 'login' ? (
          <LoginForm setForm={setForm} />
        ) : (
          <SignUpForm setForm={setForm} />
        )}
      </div>
    </div>
  )
}
