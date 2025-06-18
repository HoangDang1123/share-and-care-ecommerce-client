'use client'

import { getCoupon } from '@/app/api/coupon';
import BackButton from '@/app/ui/back-button';
import { Coupon, CouponTargetItem } from '@/interface/coupon';
import Image from 'next/image'
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react'

export default function CouponDetail() {
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [targets, setTargets] = useState<CouponTargetItem[]>([]);

  const router = useRouter();

  const param = useParams();
  const code = param.id as string;

  useEffect(() => {
    if (!code) return

    const fetchCoupon = async () => {
      try {
        const data = await getCoupon(code);
        setCoupon(data.coupon);
        setTargets(data.targets.items);
      } catch (err) {
        console.error('Lỗi khi lấy dữ liệu coupon:', err);
      }
    }

    fetchCoupon();
  }, [code]);

  return (
    <div className='md:px-12 lg:px-24 sm:my-5 md:my-20'>
      <div className='flex items-center sm:px-6 md:px-0 sm:space-x-8 md:space-x-24'>
        <BackButton />

        <ul className="flex space-x-1 sm:text-md md:text-xl whitespace-nowrap text-ellipsis">
          <li>
            <Link href="/" title='Trang chủ' className='text-gray-400 text-base hover:text-gray-900'>Trang chủ / </Link>
          </li>
          <li>
            <span className="text-base">{`Coupon Code: ${code}`}</span>
          </li>
        </ul>
      </div>
      <div className="p-6 space-y-8">
        {coupon && (
          <div className="rounded-2xl shadow-md border p-6 space-y-4 bg-white">
            <h1 className="text-2xl font-bold text-gray-800">Thông tin mã giảm giá</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 text-sm">
              <div><strong>Tên:</strong> {coupon.name}</div>
              <div><strong>Mã:</strong> {coupon.code}</div>
              <div><strong>Mô tả:</strong> {coupon.description}</div>
              <div><strong>Thời gian:</strong> {new Date(coupon.startDate).toLocaleDateString()} - {new Date(coupon.endDate).toLocaleDateString()}</div>
              <div><strong>Loại giảm:</strong> {coupon.type === 'PERCENT' ? `Giảm ${coupon.value}%` : `Giảm ${coupon.value.toLocaleString()}₫`}</div>
              <div><strong>Số lần dùng mỗi người:</strong> {coupon.maxUsesPerUser}</div>
              <div><strong>Áp dụng cho:</strong> {coupon.targetType}</div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Sản phẩm áp dụng</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {targets.map((item) => (
              <button 
                key={item.id}
                onClick={() => router.push(`/product/${item.code}`)}
                className="border rounded-xl overflow-hidden bg-white shadow-sm"
              >
                <div className="relative w-full h-48">
                  <Image
                    src={item.mainImage}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-base font-semibold text-gray-900 line-clamp-2">{item.name}</h3>
                  <p className="text-sm text-gray-500">{item.code}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
