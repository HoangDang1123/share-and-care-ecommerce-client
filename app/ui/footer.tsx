import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function Footer() {
  const footerLinks = [
    {
      title: "Cột 1",
      items: [
        { href: "/about", label: "Về chúng tôi" },
        { href: "/shop", label: "Cửa hàng" },
        { href: "/shipping", label: "Giao hàng & vận chuyển" },
        { href: "/privacy-policy", label: "Chính sách bảo mật" },
        { href: "/blog", label: "Blog" },
      ],
    },
    {
      title: "Cột 2",
      items: [
        { href: "/services", label: "Dịch vụ của chúng tôi" },
        { href: "/company-profile", label: "Hồ sơ công ty" },
        { href: "/faq", label: "Câu hỏi thường gặp" },
        { href: "/contact", label: "Liên hệ" },
        { href: "/terms", label: "Điều khoản & điều kiện" },
      ],
    },
  ];

  return (
    <div className='select-none text-white'>
      <div className="w-[85%] flex flex-wrap mx-auto border-b py-16 md-lg:pb-10 sm:pb-6">
        {/* Thông tin liên hệ */}
        <div className="w-3/12 lg:w-4/12 sm:w-full">
          <div className="flex flex-col gap-3">
            <Image
              alt="Share And Care"
              title='Cửa hàng ShareAndCare'
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
                {footerLinks.map((column, colIndex) => (
                  <ul key={colIndex} className="flex flex-col gap-2 text-sm font-semibold">
                    {column.items.map((item, index) => (
                      <li key={index}>
                        <Link href={item.href} title={item.label}>{item.label}</Link>
                      </li>
                    ))}
                  </ul>
                ))}
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
            alt="Logo VNPAY"
            title='Thanh toán qua VNPAY'
            width={100}
            height={50}
            className="object-contain"
          />
          <Image
            src="/assets/momo.png"
            alt="Logo MoMo"
            title='Thanh toán qua Momo'
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