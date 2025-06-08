'use client'

import React, { useEffect, useState } from 'react'
import { Item } from '@/interface/review';
import { convertDateTime } from '@/utils/helpers';
import { Rate } from 'antd';
import Image from 'next/image';
import { ArrowUturnDownIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import ClipLoader from 'react-spinners/ClipLoader';
import { toast } from 'react-toastify';
import { reportReview } from '@/app/api/review';
import { ExclamationTriangleIcon } from '@heroicons/react/20/solid';

interface ReviewItemProps {
  item: Item,
}

const ReviewItem: React.FC<ReviewItemProps> = ({ item }) => {
  const [userId, setUserId] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [reportReason, setReportReason] = useState<{ reason: string }>({
    reason: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setUserId(localStorage.getItem('userId') || '');
    setAccessToken(localStorage.getItem('accessToken') || '');
  }, []);

  const handleSendReport = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (userId !== "" && accessToken !== "") {
      try {
        setLoading(true);

        await reportReview(reportReason, item.id, userId, accessToken);
        setOpenDialog(false);

        toast.success("Report review successful!");

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) { }
      finally {
        setLoading(false);
      }
    }
  }

  return (
    <div className='flex flex-col justify-center items-start w-full bg-white p-4 rounded-md'>
      <div className='flex justify-between items-center w-full'>
        <div className='flex justify-center items-center gap-x-4'>
          <Image
            src={
              item.user.avatar === 'https://via.placeholder.com/400x400.png'
                ? '/assets/default-avatar-icon.jpg'
                : item.user.avatar}
            alt={item.user.avatar}
            width={100}
            height={100}
            className='w-10 h-10 rounded-full'
          />
          <div className='flex flex-col'>
            <span className='font-semibold text-base'>{item.user.name}</span>
            <span className='text-sm'>{convertDateTime(item.createdAt)}</span>
          </div>
        </div>
        <Rate
          disabled
          allowHalf
          defaultValue={item.star}
          className="text-base w-fit"
        />
      </div>

      <p className='text-base leading-8 text-justify mt-2 ml-12'>{item.content}</p>

      {item.images.length > 0 && (
        <div className='flex gap-x-4 mt-4 ml-14'>
          {item.images.map((image, index) => (
            <Image
              key={index}
              src={image}
              alt={image}
              width={500}
              height={500}
              className='object-cover w-20'
            />
          ))}
        </div>
      )}

      {item.reply && (
        <div className='flex flex-col p-4 bg-gray-100 rounded-lg mt-8 ml-28'>
          <div className='flex items-center gap-x-2'>
            <ArrowUturnDownIcon className='size-5 -rotate-90 mr-2' />
            <Image
              src={item.reply.user.avatar}
              alt={item.reply.user.avatar}
              width={100}
              height={100}
              className='w-6 h-6 rounded-full'
            />
            <span className='font-semibold text-sm'>{item.reply.user.name}</span>
          </div>

          <p className='text-sm leading-8 text-justify mt-2 ml-16'>{item.reply.content}</p>
        </div>
      )}

      <div className='flex justify-end items-center w-full mt-8'>
        <button
          onClick={() => setOpenDialog(true)}
          className=' text-red-500 font-medium text-base rounded-lg hover:text-red-600'
        >
          <ExclamationTriangleIcon className='size-8' />
        </button>
      </div>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} className="relative z-50">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-400/50 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
        />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="space-y-4 border bg-white p-12 rounded-xl">
            <DialogTitle className="font-bold">Why do you report this review?</DialogTitle>

            <textarea
              rows={4}
              value={reportReason.reason}
              onChange={(e) => setReportReason({
                reason: e.target.value,
              })}
              placeholder="Write your reason..."
              className='border-2 w-full p-2 rounded-md flex-1 overflow-y-auto ring-offset placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:text-sm flex-grow resize-none outline-none break-words box-border text-inherit'
            />

            <button
              onClick={handleSendReport}
              className='px-3 py-1 w-full bg-gray-800 text-white font-medium text-base rounded-lg hover:bg-gray-900'
            >
              {loading ? (
                <ClipLoader
                  size={20}
                  color='#ffffff'
                  aria-label="Loading Spinner"
                />
              ) : (
                <div className='flex justify-center items-center gap-x-2'>
                  <span className='font-semibold text-lg'>Send</span>
                  <PaperAirplaneIcon className='size-6' />
                </div>
              )}
            </button>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  )
}

export default ReviewItem;