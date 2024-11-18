import { Checkbox } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/24/outline';
import React from 'react'

interface SelectedAllComboboxProps {
  selectedAll: boolean,
  setSelectedAll: (selectedAll: boolean) => void,
}

const SelectedAllCombobox: React.FC<SelectedAllComboboxProps> = ({ selectedAll, setSelectedAll }) => {
  return (
    <div
      onClick={() => setSelectedAll(!selectedAll)}
      className='flex justify-center items-center space-x-2 hover:cursor-pointer'
    >
      <Checkbox
        checked={selectedAll}
        onChange={setSelectedAll}
        className="group block size-5 rounded border border-gray-700 bg-white data-[checked]:bg-gray-200"
      >
        <CheckIcon className='opacity-0 group-data-[checked]:opacity-100' />
      </Checkbox>
      <h4 className='mt-1 select-none'>Select All</h4>
    </div>
  )
}

export default SelectedAllCombobox;