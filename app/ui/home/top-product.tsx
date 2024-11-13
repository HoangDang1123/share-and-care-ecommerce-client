'use client'

import React from 'react'
import Card from './card';
import Carousel from 'react-multi-carousel';
import { Product } from '@/data/interface';
import "react-multi-carousel/lib/styles.css";

const responsive = {
    superLargeDesktop: {
        breakpoint: { max: 4000, min: 3000 },
        items: 5
    },
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 5
    },
    tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 3
    },
    mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 2
    }
};

interface TopProductProps {
    list: Array<Product>;
    title: string;
}

const TopProduct: React.FC<TopProductProps> = ({ list, title }) => {
    return (
        <div className='mt-8 px-20'>
            <div className="flex justify-between mb-2">
                <h1>{title}</h1>
                <a href="#" className="text-xl italic underline">View more</a>
            </div>

            <Carousel
                ssr={true}
                responsive={responsive}
                swipeable={true}
                draggable={true}
                infinite={true}
                containerClass='w-[1700px]'
            >
                {list.map((item, index) => {
                    return (
                        <Card key={index} product={item} />
                    )
                })}
            </Carousel>
        </div>
    );
};

export default TopProduct;
