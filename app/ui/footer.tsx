import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function Footer() {
  return (
    <div className='select-none text-white'>
      <div className="w-[85%] flex flex-wrap mx-auto border-b py-16 md-lg:pb-10 sm:pb-6">
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
              <li>Address: 01 Vo Van Ngan, Linh Chieu, Thu Duc, Ho Chi Minh</li>
              <li>Phone: 0914 722 415</li>
              <li>Email: shareandcaret@gmail.com</li>
            </ul>
          </div>
        </div>

        <div className="w-5/12 lg:w-8/12 sm:w-full">
          <div className="flex justify-center sm:justify-start sm:mt-6 w-full">
            <div>
              <h2 className="font-bold text-lg mb-2">Useful Links</h2>
              <div className="flex justify-between gap-[80px] lg:gap-[40px]">
                <ul className="flex flex-col gap-2 text-sm font-semibold">
                  <li><Link href="/about">About Us</Link></li>
                  <li><Link href="/shop">Our Shop</Link></li>
                  <li><Link href="/shipping">Shipping & Delivery</Link></li>
                  <li><Link href="/privacy-policy">Privacy Policy</Link></li>
                  <li><Link href="/blog">Blog</Link></li>
                </ul>

                <ul className="flex flex-col gap-2 text-sm font-semibold">
                  <li><Link href="/services">Our Services</Link></li>
                  <li><Link href="/company-profile">Company Profile</Link></li>
                  <li><Link href="/faq">FAQs</Link></li>
                  <li><Link href="/contact">Contact Us</Link></li>
                  <li><Link href="/terms">Terms & Conditions</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-[85%] mx-auto flex flex-col items-center gap-4 py-6">
        <h3 className="text-lg font-semibold">Our Sponsors</h3>
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

      {/* Copyright */}
      <div className="w-[90%] flex flex-wrap justify-center items-center mx-auto py-5 text-center text-sm">
        <span>© 2025 Share And Care. All Rights Reserved.</span>
      </div>
    </div>
  )
}