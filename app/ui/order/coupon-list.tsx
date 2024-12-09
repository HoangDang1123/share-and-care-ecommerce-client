'use client'

import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { AnimatePresence, easeOut, motion } from 'framer-motion';
import { Fragment } from 'react';

const CouponList = () => {
  return (
    <Disclosure as="div" defaultOpen={false}>
      {({ open }) => (
        <>
          <DisclosureButton className='flex group justify-between items-center w-full text-lg font-semibold bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200'>
            <span>Coupon</span>
            <ChevronDownIcon className='size-5 group-data-[open]:rotate-180' />
          </DisclosureButton>

          <div className='flex justify-between items-center w-full text-md font-semibold px-4 py-1 rounded-b-lg'>
            <AnimatePresence>
              {open && (
                <DisclosurePanel static as={Fragment}>
                  <motion.div
                    initial={{ opacity: 0, y: -24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -24 }}
                    transition={{ duration: 0.2, ease: easeOut }}
                    className="mt-4 w-full"
                  >
                    {/* <RadioGroup className="grid" value={selected} onChange={setSelected} aria-label="Coupon">
                      {deliveryList.map((delivery, index) => (
                        <Radio
                          key={index}
                          value={delivery}
                          className="group flex cursor-pointer"
                        >
                          <div className="flex w-full items-center justify-between space-x-10 px-4 py-2 rounded-xl hover:bg-gray-100 group-data-[checked]:bg-gray-100">
                            <span role="radio" aria-checked className="size-5 rounded-full flex justify-center items-center border border-gray-700 bg-white">
                              <div className="invisible bg-gray-700 size-2 rounded-full group-data-[checked]:visible" />
                            </span>

                            <div className='grid grid-cols-3 w-full'>
                              <h4 className='col-span-2'>{delivery.name}</h4>
                              <h4 className='col-span-1'>{delivery.phone}</h4>
                              <h4 className='col-span-3'>{`${delivery.street}, ${delivery.ward}, ${delivery.district}, ${delivery.city}`}</h4>
                            </div>

                            <button
                              onClick={(e) => handleDeleteCoupon(e, delivery.id, index)}
                              className='hover:bg-gray-300 rounded-lg'
                            >
                              {loadingItems[index] ? (
                                <ClipLoader
                                  size={20}
                                  color='#000000'
                                  aria-label="Loading Spinner"
                                />
                              ) : (
                                <XMarkIcon className='size-6 text-red-500' />
                              )}
                            </button>
                          </div>
                        </Radio>
                      ))}
                    </RadioGroup> */}
                  </motion.div>
                </DisclosurePanel>
              )}
            </AnimatePresence>
          </div>
        </>
      )}
    </Disclosure>
  )
}

export default CouponList;