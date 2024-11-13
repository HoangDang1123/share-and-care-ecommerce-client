import React from 'react'
import { AnimatePresence, motion } from 'framer-motion';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function Search() {
    return (
        <Popover as="div" className="relative ml-3">
            {({ open }) => (
                <>
                    <PopoverButton>
                        <MagnifyingGlassIcon className='size-8' />
                    </PopoverButton>
                    <AnimatePresence>
                        {open && (
                            <PopoverPanel
                                static
                                as={motion.div}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                anchor="bottom"
                                className="rounded-lg relative bg-white flex mt-5 px-20 py-10 flex-col shadow-lg w-full"
                            >
                                <input
                                    id="search"
                                    name="search"
                                    type="text"
                                    placeholder="Search..."
                                    className="block w-full rounded-md border-0 py-1.5 pl-5 text-gray-900 sm:text-sm sm:leading-6 md:text-xl ring-1 ring-inset ring-gray-400 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-400"
                                />
                            </PopoverPanel>
                        )}
                    </AnimatePresence>
                </>
            )}
        </Popover>
    )
}
