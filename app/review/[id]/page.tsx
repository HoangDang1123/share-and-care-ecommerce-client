'use client'

import { useParams, useRouter } from 'next/navigation';
import { Rate } from 'antd';
import { useEffect, useRef, useState } from 'react';
import BackButton from '@/app/ui/back-button';
import Link from 'next/link';
import { createReview } from '@/app/api/review';
import { CreateReview } from '@/interface/review';
import ClipLoader from 'react-spinners/ClipLoader';
import Image from 'next/image';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import { uploadReviewImage } from '@/app/api/upload';

export default function Page() {
  const [userId, setUserId] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [fileImages, setFileImages] = useState<File[] | undefined>();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const param = useParams();
  const id = param.id;
  const isValidId = typeof id === 'string' && id.includes('-');

  const [orderId, productId, variantId] = isValidId
    ? id.split('-')
    : ['', '', ''];

  const [review, setReview] = useState<CreateReview>({
    orderId,
    productId,
    variantId: variantId === 'null' ? null : variantId,
    star: 0,
    content: '',
    images,
  });

  useEffect(() => {
    setUserId(localStorage.getItem('userId') || '');
    setAccessToken(localStorage.getItem('accessToken') || '');
  }, []);

  useEffect(() => {
    console.log(review);
  }, [review]);

  if (!isValidId) return null;

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    const newFiles = Array.from(event.target.files);

    setFileImages(prevFiles => [...(prevFiles || []), ...newFiles]);

    const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file));
    setImages(prevImages => [...prevImages, ...newPreviewUrls]);
  };

  const handleDelete = (indexToRemove: number) => {
    setImages(prevImages => prevImages.filter((_, index) => index !== indexToRemove));
    setFileImages(prevFiles => prevFiles?.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (review.star === 0) {
      setErrorMessage("*Star is required.");
      return;
    }

    if (userId !== "" && accessToken !== "") {
      try {
        setLoading(true);

        let updatedReview = {
          ...review,
        };

        if (fileImages && fileImages.length > 0) {
          const uploadedImages = await Promise.all(
            fileImages.map(async (file) => {
              const response = await uploadReviewImage(file, userId, accessToken);
              return response;
            })
          );

          updatedReview = {
            ...updatedReview,
            images: uploadedImages,
          };
        }
        
        await createReview(updatedReview, userId, accessToken);
        toast.success("Create review successful!");
        
        router.push(`/order/${orderId}`);

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) { }
      finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className='md:px-12 lg:px-24 sm:my-5 md:my-20'>
      <div className='flex items-center sm:px-6 md:px-0 sm:space-x-8 md:space-x-24'>
        <BackButton />

        <ul className="flex space-x-1 sm:text-md md:text-xl text-ellipsis text-nowrap">
          <li>
            <Link href="/" className='text-gray-400 text-base hover:text-gray-900'>Home / </Link>
          </li>
          <li>
            <Link href="/profile" className='text-gray-400 text-base hover:text-gray-900'>Profile / </Link>
          </li>
          <li>
            <Link href={`/order/${orderId}`} className='text-gray-400 text-base hover:text-gray-900'>{`${orderId} / `}</Link>
          </li>
          <li>
            <span className="text-base">Review</span>
          </li>
        </ul>
      </div>

      <div className='w-full flex flex-col justify-center items-center mt-10'>
        <h1 className="mb-4">Write a Review</h1>
        <div className="flex flex-col items-center gap-4 p-8 w-1/2">
          <div className='flex flex-col gap-y-2 w-full'>
            <label className="block font-semibold text-lg">Star Rating</label>
            <Rate
              allowHalf
              onChange={(value) => setReview((prev) => ({
                ...prev,
                star: value,
              }))}
              value={review.star}
              className='text-4xl w-full text-center'
            />
          </div>

          <div className='flex flex-col gap-y-2 w-full'>
            <label className="block font-semibold text-lg">Your Review</label>
            <textarea
              rows={4}
              value={review.content}
              onChange={(e) => setReview((prev) => ({
                ...prev,
                content: e.target.value,
              }))}
              placeholder="Write something..."
              className='border-2 w-full p-2 rounded-md flex-1 overflow-y-auto ring-offset placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:text-sm flex-grow resize-none outline-none break-words box-border text-inherit'
            />
          </div>

          <div className={`w-full border-2 rounded-lg p-4 ${images.length === 0 ? '' : 'space-y-4'}`}>
            <div className='w-full flex gap-x-6'>
              {images.map((image, index) => (
                <div key={index} className='relative group'>
                  <Image
                    src={image}
                    alt={image}
                    width={1000}
                    height={1000}
                    className='w-full h-56 object-contain rounded-md'
                  />
                  <button
                    onClick={() => handleDelete(index)}
                    className='absolute h-auto -top-2 -right-2 rounded-md p-1 bg-red-300 hover:bg-red-500 [&_svg]:size-4'
                  >
                    <XMarkIcon className='size-3' />
                  </button>
                </div>
              ))}
            </div>
            <div className='w-auto'>
              <div
                className={`relative w-auto flex justify-center items-center bg-white rounded-md border border-dashed border-gray-400 hover:cursor-pointer focus-visible:outline-none focus-visible:ring-0 group overflow-hidden ${images.length === 0 ? 'h-72 [&_svg]:size-8' : 'h-12 [&_svg]:size-5'}`}
                onClick={handleClick}
              >
                <div className="absolute bottom-0 left-0 w-full bg-gray-600/10 transition-all duration-300 group-hover:h-full" />
                <PhotoIcon className='text-gray-400 group-hover:text-gray-500' />
              </div>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleChange}
                ref={fileInputRef}
                className="hidden"
              />
            </div>
          </div>

          {errorMessage && (
            <label className='col-span-6 flex place-self-end text-red-600'>{errorMessage}</label>
          )}

          <button
            onClick={handleSubmit}
            className='w-52 h-10 flex items-center justify-center text-lg font-semibold mt-10 text-center rounded-lg bg-gray-800 text-white hover:bg-gray-900'
          >
            {loading ? (
              <ClipLoader
                size={20}
                color='#ffffff'
                aria-label="Loading Spinner"
              />
            ) : (
              'Submit review'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
