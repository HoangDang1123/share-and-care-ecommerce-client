'use client'

import { deleteAddress, getAllAddress, getDefaultAddress, setDefault } from '@/app/api/address';
import { AddressDataResponse } from '@/interface/address';
import { Radio, RadioGroup } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { OrderData, ShippingAddressData } from '@/interface/order';
import { useOrder } from '@/app/context/AppContext';

interface AddressListProps {
  isRefresh: boolean,
  setIsRefresh: (isRefresh: boolean) => void,
  defaultAddress: AddressDataResponse | undefined,
  setExistAddress: (isRefresh: boolean) => void,
}

const AddressList: React.FC<AddressListProps> = ({ isRefresh, setIsRefresh, defaultAddress, setExistAddress }) => {
  const [addressList, setAddressList] = useState<Array<AddressDataResponse>>([]);
  const [address, setAddress] = useState<AddressDataResponse | undefined>(defaultAddress);
  const [selected, setSelected] = useState<AddressDataResponse>();
  const [loadingItems, setLoadingItems] = useState<boolean[]>([]);
  const router = useRouter();

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";
  const { setOrder } = useOrder();

  useEffect(() => {
    const fetchAddress = async () => {
      if (userId !== "" && accessToken !== "") {
        try {
          const response = await getAllAddress(userId, accessToken);
          setAddressList(response);
          setSelected(address ? address : response[0]);
          setExistAddress(response.length === 0);
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) { }
      }
    }

    fetchAddress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setAddressList, userId, accessToken, isRefresh]);

  useEffect(() => {
    const fetchAddress = async () => {
      if (userId !== "" && accessToken !== "" && selected && selected.id) {
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

      if (userId !== "" && accessToken !== "") {
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
    <div className="flex flex-col w-full space-y-4 mx-auto sm:p-4 md:p-10 md:rounded-xl md:shadow-lg">
      <h1 className="md:mb-6 sm:text-2xl md:text-3xl">Address Information</h1>
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
              <div className="flex w-full items-center justify-between sm:space-x-4 md:space-x-10 px-4 py-2 rounded-xl hover:bg-gray-100 group-data-[checked]:bg-gray-100">
                <span role="radio" aria-checked className="sm:size-3 md:size-5 rounded-full flex justify-center items-center border border-gray-700 bg-white">
                  <div className="invisible bg-gray-700 sm:size-1 md:size-2 rounded-full group-data-[checked]:visible" />
                </span>

                <div className='grid grid-cols-3 w-full'>
                  <h4 className='col-span-2 sm:text-base md:text-xl'>{address.name}</h4>
                  <h4 className='col-span-1 sm:text-base md:text-xl'>{address.phone}</h4>
                  <h4 className='font-normal col-span-3 sm:text-base md:text-xl'>{`${address.street}, ${address.ward}, ${address.district}, ${address.city}`}</h4>
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
    </div>
  )
}

export default AddressList;