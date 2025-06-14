'use client'

import { OrderDetailItem, OrderStatus } from '@/interface/order'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { formatPrice } from '@/utils/helpers';
import { useRouter } from 'next/navigation';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { CreateReturn, RefundReason } from '@/interface/return';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import ClipLoader from 'react-spinners/ClipLoader';
import { createReturnRequest } from '@/app/api/return';
import { toast } from 'react-toastify';
import { ReturnStatusCard } from './return-detail';
import { ReviewCard } from './review-detail';

interface OrderItemProps {
  item: OrderDetailItem,
  orderId: string,
  status: OrderStatus,
}

export const OrderItem: React.FC<OrderItemProps> = ({ item, orderId, status }) => {
  const [userId, setUserId] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openReviewDetail, setOpenReviewDetail] = useState(false);
  const [openReturnDetail, setOpenReturnDetail] = useState(false);
  const router = useRouter();

  const reasonLabels: Record<RefundReason, string> = {
    [RefundReason.DEFECTIVE]: "Defective",
    [RefundReason.WRONG_ITEM]: "Wrong Item",
    [RefundReason.NOT_AS_DESCRIBED]: "Not As Described",
    [RefundReason.CHANGE_MIND]: "Change Mind",
    [RefundReason.NOT_SUITABLE_SIZE]: "Not Suitable Size",
    [RefundReason.NOT_SUITABLE_STYLE]: "Not Suitable Style",
    [RefundReason.BOM_HANG]: "Bom Hang",
    [RefundReason.OTHER]: "Other",
  };

  const [request, setRequest] = useState<CreateReturn>({
    productId: item.productId,
    ...(item.variantId
      ? { variantId: item.variantId }
      : {}
    ),
    reason: '',
    description: '',
  });

  useEffect(() => {
    setUserId(localStorage.getItem('userId') || '');
    setAccessToken(localStorage.getItem('accessToken') || '');
  }, []);

  const handleSendRequest = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (userId !== "" && accessToken !== "") {
      try {
        setLoading(true);

        await createReturnRequest(orderId, request, userId, accessToken);
        setOpenDialog(false);

        toast.success("Đã yêu cầu hoàn trả");

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) { }
      finally {
        setLoading(false);
      }
    }
  }

  return (
    <div className='flex flex-col border-t-2 border-b-2 py-4'>
      <div className='flex flex-col md:flex-row justify-between gap-4'>
        <div className='flex gap-x-4'>
          <Image
            src={item.image}
            alt={item.productName}
            width={500}
            height={500}
            className='object-cover w-24 sm:w-28'
          />
          <div className='flex flex-col justify-between'>
            <div className='flex flex-col'>
              <span className='text-base font-medium'>{item.productName}</span>
              <span className='text-base'>{item.variantSlug}</span>
            </div>
            <span className='text-base'>{`Số lượng: ${item.quantity}`}</span>
          </div>
        </div>

        <div className='flex flex-col items-start md:items-end justify-between gap-4'>
          <span className='font-semibold text-base'>{`Giá: ${formatPrice(item.price)}`}</span>

          <div className='flex flex-col items-start md:items-end gap-y-2'>
            <span
              className={`inline-block text-sm font-medium px-3 py-1 rounded-lg w-fit ${item.canReturn
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-amber-50 text-amber-700'
                }`}
            >
              {item.canReturn ? `Hoàn trả trong ${item.returnDays}` : 'Không thể hoàn trả'}
            </span>

            <div className='flex flex-wrap gap-2'>
              {item.isReviewed ? (
                <button
                  onClick={() => setOpenReviewDetail(!openReviewDetail)}
                  disabled={status !== OrderStatus.DELIVERED}
                  className='flex justify-center items-center px-3 py-1 font-medium rounded-lg bg-gray-800 hover:bg-gray-900 text-white disabled:bg-gray-300'
                >
                  Xem đánh giá
                </button>
              ) : (
                <button
                  onClick={() => {
                    router.push(`/review/${orderId}-${item.productId}-${item.variantId}`)
                  }}
                  disabled={!item.canReview || status !== OrderStatus.DELIVERED}
                  className='flex justify-center items-center px-3 py-1 font-medium rounded-lg bg-gray-800 hover:bg-gray-900 text-white disabled:bg-gray-300'
                >
                  Đánh giá
                </button>
              )}

              {item.returnStatus ? (
                <button
                  onClick={() => setOpenReturnDetail(!openReturnDetail)}
                  className='inline-block text-sm font-medium px-3 py-1 text-white rounded-lg w-fit bg-gray-800 hover:bg-gray-900'
                >
                  Xem tình trạng hoàn trả
                </button>
              ) : (
                <button
                  disabled={!item.canReturn}
                  onClick={() => setOpenDialog(true)}
                  className={`inline-block text-sm font-medium px-3 py-1 text-white rounded-lg w-fit ${item.canReturn
                    ? 'bg-gray-800 hover:bg-gray-900'
                    : 'bg-gray-300'
                    }`}
                >
                  Yêu cầu hoàn trả
                </button>
              )}
            </div>
          </div>
        </div>

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} className='relative z-50'>
          <DialogBackdrop transition className='fixed inset-0 bg-gray-400/50 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in' />
          <div className='fixed inset-0 flex items-center justify-center p-4'>
            <DialogPanel className='space-y-4 border bg-white p-8 md:p-12 rounded-xl w-full max-w-md'>
              <DialogTitle className='font-bold'>Tại sao bạn muốn hoàn trả sản phẩm này?</DialogTitle>

              <div className='flex flex-col gap-y-1'>
                <label className='font-semibold' htmlFor='reason-select'>Lý do hoàn trả</label>
                <select
                  id='reason-select'
                  value={request.reason}
                  onChange={(e) => setRequest(prev => ({
                    ...prev,
                    reason: e.target.value as RefundReason
                  }))}
                  className='border-2 w-full p-2 rounded-md flex-1 ring-offset placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:text-sm'
                >
                  <option value=''>Chọn lý do hoàn trả</option>
                  {Object.entries(reasonLabels).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>

              <div className='flex flex-col gap-y-1'>
                <label className='font-semibold'>Mô tả</label>
                <textarea
                  rows={4}
                  value={request.description}
                  onChange={(e) => setRequest((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))}
                  placeholder='Nhập mô tả...'
                  className='border-2 w-full p-2 rounded-md flex-1 overflow-y-auto ring-offset placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:text-sm resize-none outline-none break-words box-border text-inherit'
                />
              </div>

              <button
                onClick={handleSendRequest}
                className='px-3 py-2 w-full bg-gray-800 text-white font-medium text-base rounded-lg hover:bg-gray-900'
              >
                {loading ? (
                  <ClipLoader size={20} color='#ffffff' aria-label='Loading Spinner' />
                ) : (
                  <div className='flex justify-center items-center gap-x-2'>
                    <span className='font-semibold text-lg'>Gửi</span>
                    <PaperAirplaneIcon className='size-6' />
                  </div>
                )}
              </button>
            </DialogPanel>
          </div>
        </Dialog>
      </div>

      {openReviewDetail && (
        <ReviewCard
          orderId={orderId}
          productId={item.productId}
          variantId={item.variantId}
        />
      )}

      {openReturnDetail && item.returnStatus && (
        <ReturnStatusCard returnStatus={item.returnStatus} />
      )}
    </div>
  )
}
