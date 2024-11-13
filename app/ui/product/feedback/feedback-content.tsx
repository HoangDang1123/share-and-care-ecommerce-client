'use client'

import React from 'react'
import { Feedback, Order } from '@/data/interface';
import { Rating } from '@mui/material';

interface FeedbackContentProps {
    feedback: Feedback & Order,
}

const FeedbackContent: React.FC<FeedbackContentProps> = ({ feedback }) => {
    return (
        <div className='flex flex-col justify-center items-start w-full bg-white p-4 rounded-md'>
            <div className='flex justify-between items-center w-full mb-6'>
                <h4 className='font-semibold'>{feedback.customerName}</h4>
                <h4>{`${feedback.productName}, ${feedback.color.name}, Size ${feedback.size}`}</h4>
            </div>

            <p className='text-lg leading-8 text-justify mb-10'>{feedback.feedback}</p>

            <div className='flex justify-between items-center w-full'>
                <Rating
                    name="rating"
                    value={feedback.rating}
                    precision={0.5}
                    readOnly
                    size='small'
                />
                <h4>{feedback.date}</h4>
            </div>
        </div>
    )
}

export default FeedbackContent;