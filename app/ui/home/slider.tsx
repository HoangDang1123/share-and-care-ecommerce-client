'use client'

import { useCallback, useEffect, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

export function Slider() {
    const images = [
        { url: "/assets/Slider.png", alt: "Slider" },
        { url: "/assets/Slider2.png", alt: "Slider2" },
        { url: "/assets/Slider3.png", alt: "Slider3" },
        { url: "/assets/Slider4.png", alt: "Slider" },
        { url: "/assets/Slider5.png", alt: "Slider" },
    ]

    const [imageIndex, setImageIndex] = useState(0);

    const showNextImage = useCallback(() => {
        setImageIndex((index) => (index === images.length - 1 ? 0 : index + 1));
    }, [images.length]);

    const showPrevImage = useCallback(() => {
        setImageIndex((index) => (index === 0 ? images.length - 1 : index - 1));
    }, [images.length]);

    useEffect(() => {
        const interval = setInterval(showNextImage, 5000);

        return () => clearInterval(interval);
    }, [showNextImage]);

    return (
        <section className="relative w-full h-full" aria-label="Slider">
            <div className="flex w-full h-full">
                {images.map(({ url, alt }, index) => (
                    <Image
                        key={index}
                        src={url}
                        alt={alt}
                        width={1920}
                        height={960}
                        aria-hidden={imageIndex !== index}
                        className="object-cover w-screen h-[960px] block flex-shrink-0 flex-grow-0 transition-transform duration-300"
                        style={{ transform: `translateX(${-100 * imageIndex}%)` }}
                        priority
                    />
                ))}
            </div>
            <button
                onClick={showPrevImage}
                className="absolute top-0 bottom-0 left-0 p-2 cursor-pointer rounded-lg hover:bg-gray-700 hover:bg-opacity-20"
                aria-label="View Previous Image"
            >
                <ChevronLeftIcon className="size-8" />
            </button>
            <button
                onClick={showNextImage}
                className="absolute top-0 bottom-0 right-0 p-2 cursor-pointer rounded-lg hover:bg-gray-700 hover:bg-opacity-20"
                aria-label="View Next Image"
            >
                <ChevronRightIcon className="size-8" />
            </button>
            <div className="absolute bottom-5 right-5 transform -translate-x-1/2 flex gap-1">
                {images.map((_, index) => (
                    <button
                        key={index}
                        className="p-0 cursor-pointer w-4 h-4 transition-transform duration-100"
                        aria-label={`View Image ${index + 1}`}
                        onClick={() => setImageIndex(index)}
                    >
                        {index === imageIndex ? (
                            <div className="bg-gray-700 w-2 h-2 rounded-full" aria-hidden />
                        ) : (
                            <div className="bg-white border-solid w-2 h-2 rounded-full" aria-hidden />
                        )}
                    </button>
                ))}
            </div>
        </section>
    );
}