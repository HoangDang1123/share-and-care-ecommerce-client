'use client'

import Image from "next/image";
import { useEffect, useState } from "react";
import ImageMagnifier from "./option/ImageMagnifier";

interface ImageSliderProps {
  images: Array<string>,
  variantImage: string,
}

const ImageList: React.FC<ImageSliderProps> = ({ images, variantImage }) => {
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    if (variantImage !== "") {
      setImageIndex(images.findIndex(item => item === variantImage));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variantImage])

  return (
    <section className="flex w-full h-[700px]" aria-label="Image List">
      <div className="flex flex-col gap-y-[0.92rem] mr-5 pr-8 overflow-x-hidden overflow-y-auto whitespace-nowrap">
        {images.map((item, index) => (
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
        {images.map((item, index) => (
          <ImageMagnifier 
            key={index} 
            imgSrc={item}
            imageIndex={imageIndex}
            index={index}
          />
        ))}
      </div>
    </section>
  )
}

export default ImageList;