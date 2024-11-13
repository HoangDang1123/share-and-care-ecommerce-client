import React from 'react'

interface DetailProps {
    category: string,
    stock: number,
    origin: string,
}

const Detail: React.FC<DetailProps> = ({ category, stock, origin }) => {
    const details = [
        { key: "Category", value: category },
        { key: "Quantity left in stock", value: stock },
        { key: "Origin", value: origin },
    ]

    return (
        <div className='flex flex-col rounded-md'>
            <div className='px-4 py-2 bg-gray-200 rounded-t-md'>
                <h6 className='text-2xl font-semibold'>Detail</h6>
            </div>
            <div className='flex my-4 px-4 space-x-10'>
                <div className='flex flex-col space-y-4'>
                    {details.map((detail, index) => (
                        <div key={index} className='flex justify-between space-x-2'>
                            <h6 className='text-xl font-semibold'>{detail.key}</h6>
                            <h6 className='text-xl font-semibold'>:</h6>
                        </div>
                    ))}
                </div>

                <div className='flex flex-col space-y-4'>
                    {details.map((detail, index) => (
                        <h6 key={index} className='text-xl'>{detail.value}</h6>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Detail;