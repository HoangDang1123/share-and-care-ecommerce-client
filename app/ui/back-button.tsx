'use client'

import { Button } from '@headlessui/react'
import { ArrowTurnDownLeftIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import React from 'react'

const BackButton = () => {
  const router = useRouter();

  const handleClick = () => {
    router.back();
  }

  return (
    <Button
      onClick={handleClick}
      className='hover:bg-gray-300 hover:rounded-md px-1 py-1'
    >
      <ArrowTurnDownLeftIcon className='sm:size-6 xl:size-8' />
    </Button>
  )
}

export default BackButton;