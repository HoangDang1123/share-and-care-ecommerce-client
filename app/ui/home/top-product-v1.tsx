'use client'

import React from 'react'
import Card from './card';
import Carousel from 'react-multi-carousel';
import "react-multi-carousel/lib/styles.css";

interface Product {
    image: string,
    name: string;
    price: string;
    rating: number;
    sold: number;
    discount: string;
}

interface TopProductProps {
    list: Array<Product>;
}

const responsive = {
    superLargeDesktop: {
        breakpoint: { max: 4000, min: 3000 },
        items: 5
    },
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 3
    },
    tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 2
    },
    mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1
    }
};

const TopProduct1: React.FC<TopProductProps> = ({ list }) => {
    return (
        <div className='mt-10'>
            <div className="flex justify-between px-10 mb-2">
                <h1>TOP SALES</h1>
                <a href="#" className="text-xl italic underline">View more</a>
            </div>

            <Carousel
                ssr={true}
                responsive={responsive}
                swipeable={true}
                showDots={true}
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

export default TopProduct1;
