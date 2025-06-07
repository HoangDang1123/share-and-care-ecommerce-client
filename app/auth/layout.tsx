import { Col, Row } from 'antd';
import Image from 'next/image'
import React, { Suspense } from 'react'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Row
      style={{ height: `calc(100vh - 200px)` }}
      className='md:px-24 py-10 bg-gray-50'
    >
      <Col span={17}>
      <Image
        alt="auth-thumb"
        src="/assets/auth-thumb.jpg"
        priority
        width={1920}
        height={1080}
        className="sm:hidden md:block w-full h-full object-cover rounded-lg"
      />
      </Col>

      <Col span={1} />

      <Col span={6} className='h-full flex flex-col justify-center shadow-xl rounded-lg px-16'>
        <Suspense>{children}</Suspense>
      </Col>
    </Row>
  )
}
