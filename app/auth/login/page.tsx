'use client'

import Image from 'next/image'
import React from 'react'
import dynamic from 'next/dynamic'

const LoginForm = dynamic(() => import('../../ui/auth/login-form'), { ssr: false })

export default function Page() {
    return (
        <div
            style={{ height: `calc(100vh - 200px)` }}
            className='flex justify-center items-center space-x-20 px-20 py-10 bg-gray-50'
        >
            <Image
                alt="Login Thumb"
                src="/assets/Login-thumb.png"
                priority
                width={1920}
                height={1080}
                style={{ width: "auto", height: "auto" }}
            />

            <LoginForm />
        </div>
    )
}
