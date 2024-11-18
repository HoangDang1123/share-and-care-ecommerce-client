'use client'

import { Rating, Slider, styled } from '@mui/material';
import React, { useEffect } from 'react'
import { StarIcon } from '@heroicons/react/20/solid';
import { Feedback } from '@/data/interface';
import { usePathname } from 'next/navigation';

interface FeedbackRatingProps {
    feedbacks: Array<Feedback>,
    rating: number,
    isFixed: boolean,
    setIsFixed: (isFixed: boolean) => void;
}

const StyledSlider = styled(Slider)({
    width: "200px",
    height: "15px",
    padding: "0px",
    '& .MuiSlider-thumb': {
        display: "none"
    },
    '& .MuiSlider-track': {
        color: "#1155CC",
        borderTopRightRadius: "0px",
        borderBottomRightRadius: "0px",
    },
});

const FeedbackRating: React.FC<FeedbackRatingProps> = ({ feedbacks, rating, isFixed, setIsFixed }) => {
    const lastItem = usePathname().substring(usePathname().lastIndexOf('/') + 1);
    
    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const triggerPoint = 80;

            if (scrollTop > triggerPoint && lastItem === 'feedback') {
                setIsFixed(true);
            } else {
                setIsFixed(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [lastItem, setIsFixed]);

    const ratingList = Array.from({ length: 5 }, (_, index) => ({
        star: index + 1,
        count: 0,
    }));

    feedbacks.forEach(feedback => {
        const { rating } = feedback;
        if (rating >= 1 && rating <= 5) {
            ratingList[rating - 1].count += 1;
        }
    });
    ratingList.reverse();

    return (
        <div className={`flex justify-center items-center bg-gray-200 rounded-2xl p-6 mt-24 transition-all duration-300 ease-in-out ${isFixed ? 'fixed top-44' : ''}`}>
            <div className='flex flex-col justify-center items-center space-y-2'>
                <h6 className='text-5xl font-semibold'>{`${rating}`}</h6>
                <Rating
                    name="rating"
                    value={rating}
                    precision={0.5}
                    readOnly
                    size='large'
                />
                <div className='flex justify-center items-center w-full space-x-4'>
                    <div className='flex flex-col items-center space-y-3'>
                        {ratingList.map((item, index) => (
                            <div key={index} className='flex items-center'>
                                {Array.from({ length: item.star }, (_, index) => (
                                    <StarIcon key={index} className='size-4' />
                                ))}
                            </div>
                        ))}
                    </div>
                    <div className='flex flex-col justify-start items-center space-y-3'>
                        {ratingList.map((item, index) => (
                            <StyledSlider
                                key={index}
                                disabled
                                aria-label='Rating Slider'
                                valueLabelDisplay="auto"
                                value={item.count}
                                max={feedbacks.length}
                            />
                        ))}
                    </div>
                    <div className='flex flex-col justify-start items-center'>
                        {ratingList.map((item, index) => (
                            <h6 key={index} className='text-lg'>{`(${item.count})`}</h6>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FeedbackRating;