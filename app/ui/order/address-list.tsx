'use client'

import { deleteAddress, getAllAddress, getDefaultAddress, setDefault } from '@/app/api/address';
import { AddressDataResponse } from '@/interface/address';
import { Disclosure, DisclosureButton, DisclosurePanel, Radio, RadioGroup } from '@headlessui/react';
import { ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { AnimatePresence, easeOut, motion } from 'framer-motion';
import { Fragment, useEffect, useState } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { OrderData, ShippingAddressData } from '@/interface/order';
import { useOrder } from '@/app/context/AuthContext';

interface AddressListProps {
  isRefresh: boolean,
  setIsRefresh: (isRefresh: boolean) => void,
  defaultAddress: AddressDataResponse | undefined,
}

const AddressList: React.FC<AddressListProps> = ({ isRefresh, setIsRefresh, defaultAddress }) => {
  const [addressList, setAddressList] = useState<Array<AddressDataResponse>>([]);
  const [address, setAddress] = useState<AddressDataResponse | undefined>(defaultAddress);
  const [selected, setSelected] = useState<AddressDataResponse>();
  const [loadingItems, setLoadingItems] = useState<boolean[]>([]);
  const router = useRouter();

  const userId = localStorage.getItem('userId');
  const accessToken = localStorage.getItem('accessToken');
  const { setOrder } = useOrder();

  useEffect(() => {
    const fetchAddress = async () => {
      if (userId !== null && accessToken !== null) {
        try {
          const response = await getAllAddress(userId, accessToken);
          setAddressList(response);
          setSelected(address ? address : response[0]);
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) { }
      }
    }

    fetchAddress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setAddressList, userId, accessToken, isRefresh]);

  useEffect(() => {
    const fetchAddress = async () => {
      if (userId !== null && accessToken !== null && selected && selected.id) {
        try {
          await setDefault(selected.id, userId, accessToken);
          const response = await getDefaultAddress(userId, accessToken);
          setAddress(response);
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchAddress();
  }, [userId, accessToken, selected]);

  useEffect(() => {
    if (address) {
      setOrder(prevOrder => {
        const newShippingAddress: ShippingAddressData = {
          fullname: address.name,
          phone: address.phone,
          street: address.street,
          ward: address.ward,
          district: address.district,
          city: address.city,
        };

        return {
          ...prevOrder,
          shippingAddress: newShippingAddress,
        } as OrderData;
      });
    }
  }, [address, setOrder]);

  useEffect(() => {
    if (isRefresh) {
      router.refresh();
      setIsRefresh(false);
    }
  }, [isRefresh, router, setIsRefresh]);

  const handleDeleteAddress = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: string, index: number) => {
    e.stopPropagation();
    const fetchDeleteCartItem = async () => {
      const newLoadingItems = [...loadingItems];
      newLoadingItems[index] = true;
      setLoadingItems(newLoadingItems);

      if (userId !== null && accessToken !== null) {
        try {
          await deleteAddress(id, userId, accessToken);
          try {
            const response = await getAllAddress(userId, accessToken);
            setAddressList(response);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
          } catch (error) { }

          toast.success("Delete address successful.");
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          toast.error("Failed to delete address.");
        } finally {
          newLoadingItems[index] = false;
          setLoadingItems(newLoadingItems);
        }
      }
    };

    fetchDeleteCartItem();
  };

  return (
    <Disclosure as="div" defaultOpen={false}>
      {({ open }) => (
        <>
          <DisclosureButton className='flex group justify-between items-center w-full text-lg font-semibold bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200'>
            <span>Saved Address</span>
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
                    {addressList.length === 0 ? (
                      <div className='flex justify-center items-center w-full text-lg py-4'>There&apos;s no address.</div>
                    ) : (
                      <RadioGroup className="grid" value={selected} onChange={setSelected} aria-label="Address">
                        {addressList.map((address, index) => (
                          <Radio
                            key={index}
                            value={address}
                            className="group flex cursor-pointer"
                          >
                            <div className="flex w-full items-center justify-between space-x-10 px-4 py-2 rounded-xl hover:bg-gray-100 group-data-[checked]:bg-gray-100">
                              <span role="radio" aria-checked className="size-5 rounded-full flex justify-center items-center border border-gray-700 bg-white">
                                <div className="invisible bg-gray-700 size-2 rounded-full group-data-[checked]:visible" />
                              </span>

                              <div className='grid grid-cols-3 w-full'>
                                <h4 className='col-span-2'>{address.name}</h4>
                                <h4 className='col-span-1'>{address.phone}</h4>
                                <h4 className='font-normal col-span-3'>{`${address.street}, ${address.ward}, ${address.district}, ${address.city}`}</h4>
                              </div>

                              <button
                                onClick={(e) => handleDeleteAddress(e, address.id, index)}
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
                      </RadioGroup>
                    )}
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

export default AddressList;