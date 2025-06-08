'use client';

import { getAllDelivery } from '@/app/api/delivery';
import { useOrder } from '@/app/context/AppContext';
import { AddressResponse } from '@/interface/address';
import { Delivery } from '@/interface/delivery';
import { CreateOrder } from '@/interface/order';
import { Radio, RadioGroup } from '@headlessui/react';
import { useEffect, useState } from 'react';
import { TruckIcon } from '@heroicons/react/24/outline';
import { PaperAirplaneIcon } from '@heroicons/react/20/solid';

interface DeliveryListProps {
  defaultAddress: AddressResponse | undefined;
}

const DeliveryList: React.FC<DeliveryListProps> = ({ defaultAddress }) => {
  const [deliveryList, setDeliveryList] = useState<Array<Delivery>>([]);
  const [selected, setSelected] = useState<Delivery | null>(null);
  const { setOrder } = useOrder();

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";

  useEffect(() => {
    const fetchDelivery = async () => {
      if (userId !== "" && accessToken !== "" && defaultAddress?.placeId) {
        try {
          const response = await getAllDelivery(defaultAddress.placeId, userId, accessToken);
          setDeliveryList(response.deliveries);
          if (response.deliveries.length > 0) {
            setSelected(response.deliveries[0]);
          }
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) { }
      }
    };
    fetchDelivery();
  }, [accessToken, defaultAddress, setDeliveryList, userId]);

  useEffect(() => {
    if (selected) {
      setOrder(prevOrder => ({
        ...prevOrder,
        deliveryId: selected.id,
      } as CreateOrder));

      if (typeof window !== "undefined") {
        localStorage.setItem('deliveryFee', selected.fee.toString());
      }
    }
  }, [selected, setOrder]);

  return (
    <div className="flex flex-col w-full space-y-4 mx-auto sm:p-4 md:p-10 md:rounded-xl md:shadow-lg">
      <h1 className="flex items-center gap-2 text-2xl font-bold mb-4 text-gray-800">
        <PaperAirplaneIcon className="w-7 h-7" />
        Delivery Method
      </h1>

      {deliveryList.length === 0 ? (
        <div className="flex justify-center items-center w-full text-base py-4 text-gray-500">
          There&apos;s no delivery available.
        </div>
      ) : (
        <RadioGroup value={selected} onChange={setSelected} aria-label="Delivery Method" className="space-y-3">
          {deliveryList.map((delivery) => (
            <Radio
              key={delivery.name}
              value={delivery}
              className="group flex cursor-pointer border border-gray-200 rounded-xl hover:bg-gray-100 group-data-[checked]:bg-gray-100 group-data-[checked]:border-gray-700 transition-colors"
            >
              <div className="flex w-full items-center justify-between sm:space-x-4 md:space-x-10 px-4 py-2 text-gray-800 rounded-xl hover:bg-gray-100 group-data-[checked]:bg-gray-100 group-data-[checked]:outline group-data-[checked]:outline-2 group-data-[checked]:outline-gray-700">
                <div className="flex items-start space-x-3">
                  <TruckIcon className="w-5 h-5 text-gray-600 mt-1" />
                  <div className="flex flex-col">
                    <h4 className="text-sm md:text-base font-semibold text-gray-800">{delivery.name}</h4>
                    <p className="text-sm text-gray-600">{delivery.description}</p>
                  </div>
                </div>
                <span role="radio" aria-checked className="sm:size-3 md:size-5 rounded-full flex justify-center items-center border border-gray-700 bg-white">
                  <div className="invisible bg-gray-700 sm:size-1.5 md:size-2 rounded-full group-data-[checked]:visible" />
                </span>
              </div>
            </Radio>
          ))}
        </RadioGroup>
      )}
    </div>
  );
};

export default DeliveryList;
