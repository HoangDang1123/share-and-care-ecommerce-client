'use client'

import { deleteAddress, getAllAddress, getDefaultAddress, setDefault } from '@/app/api/address';
import { AddressResponse } from '@/interface/address';
import { Radio, RadioGroup } from '@headlessui/react';
import { MapPinIcon, PhoneIcon, UserIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { CreateOrder, ShippingAddress } from '@/interface/order';
import { useOrder } from '@/app/context/AppContext';
import { HomeIcon } from '@heroicons/react/20/solid';

interface AddressListProps {
  isRefresh: boolean,
  setIsRefresh: (isRefresh: boolean) => void,
  defaultAddress: AddressResponse | undefined,
  setExistAddress: (isRefresh: boolean) => void,
}

const AddressList: React.FC<AddressListProps> = ({ isRefresh, setIsRefresh, defaultAddress, setExistAddress }) => {
  const [addressList, setAddressList] = useState<Array<AddressResponse>>([]);
  const [address, setAddress] = useState<AddressResponse | undefined>(defaultAddress);
  const [selected, setSelected] = useState<AddressResponse>();
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
        const newShippingAddress: ShippingAddress = {
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
        } as CreateOrder;
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
    const fetchDeleteItem = async () => {
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

    fetchDeleteItem();
  };

  return (
    <div className="flex flex-col w-full space-y-4 mx-auto sm:p-4 md:p-10 md:rounded-xl md:shadow-lg">
      <h1 className="flex items-center gap-2 text-2xl font-bold mb-4 text-gray-800">
        <HomeIcon className="w-7 h-7" />
        Address Information
      </h1>
      {addressList.length === 0 ? (
        <div className='flex justify-center items-center w-full text-lg py-4'>There&apos;s no address.</div>
      ) : (
        <RadioGroup className="grid gap-y-4" value={selected} onChange={setSelected} aria-label="Address">
          {addressList.map((address, index) => (
            <Radio
              key={index}
              value={address}
              className="group flex cursor-pointer border border-gray-200 rounded-xl hover:bg-gray-100 group-data-[checked]:bg-gray-100 group-data-[checked]:border-gray-700 transition-colors"
            >
              <div className="flex w-full items-center justify-between sm:space-x-4 md:space-x-10 px-4 py-2 text-gray-800 rounded-xl hover:bg-gray-100 group-data-[checked]:bg-gray-100 group-data-[checked]:outline group-data-[checked]:outline-2 group-data-[checked]:outline-gray-700">
                <span role="radio" aria-checked className="sm:size-3 md:size-5 rounded-full flex justify-center items-center border border-gray-700 bg-white">
                  <div className="invisible bg-gray-700 sm:size-1 md:size-2 rounded-full group-data-[checked]:visible" />
                </span>

                <div className="flex flex-col w-full space-y-2">
                  <div className="flex items-center space-x-2">
                    <UserIcon className="w-5 h-5 text-orange-500" />
                    <h4 className="sm:text-sm md:text-base font-semibold text-gray-800">{address.name}</h4>
                  </div>

                  <div className="flex items-center space-x-2">
                    <PhoneIcon className="w-5 h-5 text-green-500" />
                    <h4 className="sm:text-sm md:text-base text-gray-700">{address.phone}</h4>
                  </div>

                  <div className="flex items-center space-x-2">
                    <MapPinIcon className="w-5 h-5 text-blue-500" />
                    <h4 className="sm:text-sm md:text-base text-gray-700">
                      {`${address.street}, ${address.ward}, ${address.district}, ${address.city}`}
                    </h4>
                  </div>
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