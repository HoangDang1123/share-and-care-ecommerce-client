import Image from 'next/image'
import React, { Suspense } from 'react'

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
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
                className="w-full h-full"
            />

            <div className='w-[600px] h-full flex flex-col justify-center shadow-xl px-16'>
                <Suspense>{children}</Suspense>
            </div>
        </div>
    )
}
