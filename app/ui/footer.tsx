import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function Footer() {
  return (
    <div className='select-none text-white'>
      <div className="w-[85%] flex flex-wrap mx-auto border-b py-16 md-lg:pb-10 sm:pb-6">
        {/* Thông tin liên hệ */}
        <div className="w-3/12 lg:w-4/12 sm:w-full">
          <div className="flex flex-col gap-3">
            <Image
              alt="Share And Care"
              src="/assets/logo.png"
              width={120}
              height={100}
              className="w-[170px] h-[80px]"
            />
            <ul className="flex flex-col gap-2 text-sm">
              <li>Địa chỉ: 01 Võ Văn Ngân, Linh Chiểu, Thủ Đức, TP. Hồ Chí Minh</li>
              <li>Điện thoại: (+84) 914 722 415</li>
              <li>Email: shareandcaret@gmail.com</li>
            </ul>
          </div>
        </div>

        {/* Liên kết hữu ích */}
        <div className="w-5/12 lg:w-8/12 sm:w-full">
          <div className="flex justify-center sm:justify-start sm:mt-6 w-full">
            <div>
              <span className="font-bold text-lg">Liên kết hữu ích</span>
              <div className="flex justify-between gap-[80px] lg:gap-[40px]">
                <ul className="flex flex-col gap-2 text-sm font-semibold">
                  <li><Link href="/about">Về chúng tôi</Link></li>
                  <li><Link href="/shop">Cửa hàng</Link></li>
                  <li><Link href="/shipping">Giao hàng & vận chuyển</Link></li>
                  <li><Link href="/privacy-policy">Chính sách bảo mật</Link></li>
                  <li><Link href="/blog">Blog</Link></li>
                </ul>

                <ul className="flex flex-col gap-2 text-sm font-semibold">
                  <li><Link href="/services">Dịch vụ của chúng tôi</Link></li>
                  <li><Link href="/company-profile">Hồ sơ công ty</Link></li>
                  <li><Link href="/faq">Câu hỏi thường gặp</Link></li>
                  <li><Link href="/contact">Liên hệ</Link></li>
                  <li><Link href="/terms">Điều khoản & điều kiện</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Nhà tài trợ */}
      <div className="w-[85%] mx-auto flex flex-col items-center gap-4 py-6">
        <span className="text-lg font-semibold">Nhà tài trợ</span>
        <div className="flex items-center gap-6">
          <Image
            src="/assets/vnpay.png"
            alt="VNPAY"
            width={100}
            height={50}
            className="object-contain"
          />
          <Image
            src="/assets/momo.png"
            alt="MoMo"
            width={100}
            height={50}
            className="object-contain"
          />
        </div>
      </div>

      {/* Bản quyền */}
      <div className="w-[90%] flex flex-wrap justify-center items-center mx-auto py-5 text-center text-sm">
        <span>© 2025 Share And Care. All Rights Reserved.</span>
      </div>
    </div>

  )
}