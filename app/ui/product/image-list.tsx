'use client'

import Image from "next/image";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import ImageMagnifier from "./image-magnifier";

interface ImageSliderProps {
  images: string[],
  video: string,
  variantImage: string,
}

const getYoutubeThumbnail = (url: string) => {
  const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]+)/);
  return match ? `https://img.youtube.com/vi/${match[1]}/0.jpg` : "";
};

const ImageList: React.FC<ImageSliderProps> = ({ images, video, variantImage }) => {
  const [imageIndex, setImageIndex] = useState(0);
  const [isVideo, setIsVideo] = useState(false);
  const videoThumbnail = getYoutubeThumbnail(video);

  useEffect(() => {
    if (variantImage !== "") {
      setImageIndex(images.findIndex(item => item === variantImage));
      setIsVideo(false);
    }
  }, [images, variantImage]);

  return (
    <section className="flex sm:flex-col md:flex-row w-full md:h-full" aria-label="Image List">
      <div className="sm:hidden md:flex flex-col h-[45.5rem] gap-y-[0.92rem] mr-3 pr-8 overflow-x-hidden overflow-y-auto whitespace-nowrap scroll-y-list">
        {videoThumbnail && (
          <div
            className="cursor-pointer w-24 hover:opacity-60"
            onClick={() => {
              setIsVideo(true);
              setImageIndex(-1);
            }}
          >
            <Image
              src={videoThumbnail}
              alt={videoThumbnail}
              title={videoThumbnail}
              width={100}
              height={30}
              className="object-cover rounded-xl"
            />
          </div>
        )}

        {images.map((item, index) => (
          <div
            key={index}
            className="cursor-pointer w-24 hover:opacity-60"
            onClick={() => {
              setImageIndex(index);
              setIsVideo(false);
            }}
          >
            <Image
              src={item}
              alt={item}
              title={item}
              width={100}
              height={30}
              className="object-cover rounded-xl"
              priority
            />
          </div>
        ))}
      </div>

      <div className="sm:hidden xl:flex w-full">
        {isVideo ? (
          <div className="w-full bg-black flex items-center justify-center rounded-2xl overflow-hidden">
            <ReactPlayer
              url={video}
              width="100%"
              controls
            />
          </div>
        ) : (
          images.map((item, index) => (
            <ImageMagnifier
              key={index}
              src={item}
              alt={item}
              title={item}
              className={`${imageIndex === index ? 'block rounded-2xl' : 'hidden'}`}
              width={600}
              height={600}
              magnifierHeight={150}
              magnifierWidth={150}
              zoomLevel={2}
            />
          ))
        )}
      </div>

      <div className="sm:flex xl:hidden w-full">
        {isVideo ? (
          <ReactPlayer url={video} width="100%" controls />
        ) : (
          images.map((item, index) => (
            <Image
              key={index}
              src={item}
              alt={item}
              title={item}
              width={1920}
              height={1080}
              className={`${imageIndex === index ? 'block' : 'hidden'} object-cover w-full`}
              priority
            />
          ))
        )}
      </div>

      <div className="sm:flex md:hidden gap-x-2 mt-2 overflow-x-auto whitespace-nowrap scroll-x-list">
        {videoThumbnail && (
          <div
            className="cursor-pointer w-24 hover:opacity-60"
            onClick={() => {
              setIsVideo(true);
              setImageIndex(-1);
            }}
          >
            <Image
              src={videoThumbnail}
              alt={videoThumbnail}
              title={videoThumbnail}
              width={80}
              height={24}
              className="object-cover"
            />
          </div>
        )}

        {images.map((item, index) => (
          <div
            key={index}
            className="cursor-pointer w-24 hover:opacity-60"
            onClick={() => {
              setImageIndex(index);
              setIsVideo(false);
            }}
          >
            <Image
              src={item}
              alt={item}
              title={item}
              width={80}
              height={24}
              className="object-cover"
              priority
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ImageList;