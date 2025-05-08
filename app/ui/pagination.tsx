import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  return (
    <div className="flex items-center justify-end">
      <span className="text-gray-700 text-lg">
        {`${(currentPage - 1) * itemsPerPage + 1}-${Math.min(
          currentPage * itemsPerPage,
          totalItems
        )} of ${totalItems}`}
      </span>

      <div className="flex items-center ml-4">
        <button
          onClick={handlePreviousPage}
          className={`mr-4 px-1 py-1 rounded-md ${currentPage === 1
            ? 'text-gray-300 cursor-not-allowed'
            : 'text-gray-800 hover:text-black hover:bg-gray-200'
            }`}
          disabled={currentPage === 1}
        >
          <ChevronLeftIcon className='size-8' />
        </button>
        <button
          onClick={handleNextPage}
          className={`px-1 py-1 rounded-md ${currentPage === totalPages
            ? 'text-gray-300 cursor-not-allowed'
            : 'text-gray-800 hover:text-black hover:bg-gray-200'
            }`}
          disabled={currentPage === totalPages}
        >
          <ChevronRightIcon className='size-8' />
        </button>
      </div>
    </div>
  );
};

export default Pagination;