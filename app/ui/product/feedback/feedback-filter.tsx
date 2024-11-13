'use client'

import React from 'react'

interface FeedbackFilterProps {
    setRatingFilter: (ratingFilter: string) => void,
}

const FeedbackFilter: React.FC<FeedbackFilterProps> = ({ setRatingFilter }) => {
    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setRatingFilter(event.target.value);
    }

    const handleSelectClick = (event: React.MouseEvent<HTMLSelectElement>) => {
        event.stopPropagation();
    }

    const handleOptionClick = (event: React.MouseEvent<HTMLOptionElement>) => {
        event.stopPropagation();
    }

    return (
        <div className='flex justify-center items-center space-x-8'>
            <select
                onChange={handleChange}
                onClick={handleSelectClick}
                className="border border-gray-700 rounded-md p-2 text-lg w-40"
            >
                <option value="all" onClick={handleOptionClick}>Rating </option>
                <option value="1" onClick={handleOptionClick}>1 Star</option>
                <option value="2" onClick={handleOptionClick}>2 Star</option>
                <option value="3" onClick={handleOptionClick}>3 Star</option>
                <option value="4" onClick={handleOptionClick}>4 Star</option>
                <option value="5" onClick={handleOptionClick}>5 Star</option>
            </select>

            <select className="border rounded-md p-2 text-lg w-40" disabled>
                <option value="">Image </option>
                <option value="image">Has image</option>
                <option value="no-image">No image</option>
            </select>

            <select className="border rounded-md p-2 text-lg w-40" disabled>
                <option value="">Reply </option>
                <option value="replied">Replied</option>
                <option value="not-reply-yet">No reply yet</option>
            </select>
        </div>
    )
}

export default FeedbackFilter;