'use client'

import Image from "next/image";
import { useEffect, useState } from "react";
import ImageMagnifier from "./image-magnifier";

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
    <section className="flex sm:flex-col md:flex-row w-full md:h-[700px]" aria-label="Image List">
      <div className="sm:hidden md:flex flex-col gap-y-[0.92rem] mr-5 pr-8 overflow-x-hidden overflow-y-auto whitespace-nowrap scroll-y-list">
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

      <div className="sm:hidden xl:flex w-full">
        {images.map((item, index) => (
          <ImageMagnifier
            key={index}
            src={item}
            className={`${imageIndex === index ? 'block' : 'hidden'}`}
            width={600}
            height={600}
            magnifierHeight={150}
            magnifierWidth={150}
            zoomLevel={2}
            alt="Main Image"
          />
        ))}
      </div>

      <div className="sm:flex xl:hidden w-full">
        {images.map((item, index) => (
          <Image
            key={index}
            src={item}
            alt=""
            width={1920}
            height={1080}
            aria-hidden={imageIndex !== index}
            className={`${imageIndex === index ? 'block' : 'hidden'} object-cover w-full`}
          />
        ))}
      </div>

      <div className="sm:flex md:hidden gap-x-2 mt-2 overflow-x-auto whitespace-nowrap scroll-x-list">
        {images.map((item, index) => (
          <div
            key={index}
            aria-label={`View Image ${index + 1}`}
            onClick={() => setImageIndex(index)}
            className="flex-shrink-0"
          >
            <Image
              key={index}
              src={item}
              alt=""
              width={80}
              height={24}
              aria-hidden={imageIndex !== index}
              className="object-cover"
              priority
            />
          </div>
        ))}
      </div>
    </section>
  )
}

export default ImageList;