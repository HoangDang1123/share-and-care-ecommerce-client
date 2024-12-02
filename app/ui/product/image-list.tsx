'use client'

import Image from "next/image";
import { useState } from "react";

interface ImageSliderProps {
  images: Array<string>,
}

const ImageList: React.FC<ImageSliderProps> = ({ images }) => {
  const [imageIndex, setImageIndex] = useState(0);

  return (
    <section className="flex w-full h-[700px]" aria-label="Image List">
      <div className="flex flex-col gap-y-[0.92rem] mr-5">
        {images.slice(0, 5).map((item, index) => (
          <div
            key={index}
            className="cursor-pointer w-24 hover:opacity-60"
            aria-label={`View Image ${index + 1}`}
            onClick={() => setImageIndex(index)}
          >
            <Image
              key={index}
              src={item}
              alt=""
              width={100}
              height={30}
              aria-hidden={imageIndex !== index}
              className="object-cover"
              priority
            />
          </div>
        ))}
      </div>

      <div className="flex w-full">
        {images.slice(0, 5).map((item, index) => (
          <Image
            key={index}
            src={item}
            alt=""
            width={1920}
            height={1080}
            aria-hidden={imageIndex !== index}
            className={`${imageIndex === index ? 'block' : 'hidden'} object-cover w-auto`}
          />
        ))}
      </div>
    </section>
  )
}

export default ImageList;