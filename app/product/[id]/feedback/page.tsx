'use client'

import React, { useEffect, useState } from 'react';
import data from "@/data/data.json";
import FeedbackContent from '@/app/ui/product/feedback/feedback-content';
import { useParams } from 'next/navigation';
import FeedbackFilter from '@/app/ui/product/feedback/feedback-filter';
import Link from 'next/link';
import { ArrowTurnDownLeftIcon } from '@heroicons/react/24/outline';
import { TablePagination } from '@mui/material';

export default function Page() {
    // const [page, setPage] = React.useState(1);
    // const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const params = useParams();
    const id = params.id;
    const product = data.products.find(item => item.id === id);

    const [ratingFilter, setRatingFilter] = useState("all");
    const newParams = new URLSearchParams(window.location.search);

    newParams.set('ratingFilter', ratingFilter);
    const orders = data.orders.filter(item => item.productId === id);
    const orderIds = orders.map(order => order.id);
    const feedbacks = data.feedbacks.filter(item => orderIds.includes(item.orderId));

    const newFeedbacks = feedbacks.map(feedback => {
        const order = orders.find(order => order.id === feedback.orderId);
        if (order) {
            return { ...feedback, ...order };
        }
        return null;
    }).filter(item => item !== null);

    const filteredFeedbacks = ratingFilter === "all"
        ? newFeedbacks
        : newFeedbacks.filter(feedback => feedback.rating === Number(ratingFilter));

    useEffect(() => {
        if (ratingFilter !== "all") {
            window.history.pushState(null, '', `?${params.toString()}`)
        }
    })

    // const handleChangePage = (
    //     event: React.MouseEvent<HTMLButtonElement> | null,
    //     newPage: number,
    // ) => {
    //     setPage(newPage);
    // };

    // const handleChangeRowsPerPage = (
    //     event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    // ) => {
    //     setRowsPerPage(parseInt(event.target.value, 10));
    //     setPage(0);
    // };

    if (!product) {
        return <div>Product not found</div>;
    }

    return (
        <div className='px-24 py-10'>
            <div className='flex items-center space-x-24'>
                <Link
                    href={`/product/${id}`}
                    passHref
                    className='hover:bg-gray-300 hover:rounded-md px-1 py-1'
                >
                    <ArrowTurnDownLeftIcon className='size-8' />
                </Link>

                <ul className="flex space-x-1 text-xl">
                    <li>
                        <Link href="/" className='text-gray-400 hover:text-gray-900'>Home / </Link>
                    </li>
                    <li>
                        <Link href="#" className='text-gray-400 hover:text-gray-900'>{`${product.category} /`}</Link>
                    </li>
                    <li>
                        <Link href={`/product/${id}`} className='text-gray-400 hover:text-gray-900'>{`${product.name} /`}</Link>
                    </li>
                    <li>
                        Feedback
                    </li>
                </ul>
            </div>

            <div className='flex flex-col justify-center items-center w-full px-44 mt-10'>
                <FeedbackFilter setRatingFilter={setRatingFilter} />

                <div className='flex flex-col justify-center items-center w-full mt-10 space-y-10'>
                    {newFeedbacks.length === 0 ? (
                        <div>No feedback yet.</div>
                    ) : (
                        filteredFeedbacks.map((filteredFeedback, index) => (
                            <FeedbackContent key={index} feedback={filteredFeedback} />
                        ))
                    )}
                </div>
            </div>

            {/* <TablePagination
                component="div"
                count={100}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            /> */}
        </div>
    );
}