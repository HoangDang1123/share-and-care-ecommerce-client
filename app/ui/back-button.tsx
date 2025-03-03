'use client'

import { ArrowTurnDownLeftIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import React from 'react'

interface BackButtonProps {
    previousPathname: string,
}

const BackButton: React.FC<BackButtonProps> = ({ previousPathname }) => {
    return (
        <Link
            href={previousPathname}
            passHref
            className='hover:bg-gray-300 hover:rounded-md px-1 py-1'
        >
            <ArrowTurnDownLeftIcon className='sm:size-6 xl:size-8' />
        </Link>
    )
}

export default BackButton;