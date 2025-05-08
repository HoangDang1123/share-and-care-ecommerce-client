import { getAllDelivery } from '@/app/api/delivery'
import { useOrder } from '@/app/context/AppContext'
import { AddressResponse } from '@/interface/address'
import { Delivery } from '@/interface/delivery'
import { OrderData } from '@/interface/order'
import { Radio, RadioGroup } from '@headlessui/react'
import { useEffect, useState } from 'react'

interface DeliveryListProps {
  defaultAddress: AddressResponse | undefined,
}

const DeliveryList: React.FC<DeliveryListProps> = ({ defaultAddress }) => {
  const [deliveryList, setDeliveryList] = useState<Array<Delivery>>([]);
  const [selected, setSelected] = useState<Delivery | null>(null);
  const { setOrder } = useOrder();

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";

  useEffect(() => {
    const fetchDelivery = async () => {
      if (userId !== "" && accessToken !== "" && defaultAddress && defaultAddress.placeId) {
        try {
          const response = await getAllDelivery(defaultAddress.placeId, userId, accessToken);
          setDeliveryList(response.deliveries);
          if (response.deliveries.length > 0) {
            setSelected(response.deliveries[0]);
          }
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) { }
      }
    }

    fetchDelivery()
  }, [accessToken, defaultAddress, setDeliveryList, userId]);

  useEffect(() => {
    if (selected) {
      setOrder(prevOrder => {
        return {
          ...prevOrder,
          deliveryId: selected.id,
        } as OrderData;
      });

      if (typeof window !== "undefined") {
        localStorage.setItem('deliveryFee', selected.fee.toString());
      }
    }
  }, [selected, setOrder]);

  return (
    <div className="flex flex-col w-full space-y-4 mx-auto sm:p-4 md:p-10 md:rounded-xl md:shadow-lg">
      <h1 className="md:mb-6 sm:text-2xl md:text-3xl">Delivery Method</h1>
      {deliveryList.length === 0 ? (
        <div className='flex justify-center items-center w-full text-lg py-4'>There&apos;s no delivery.</div>
      ) : (
        <RadioGroup value={selected} onChange={setSelected} aria-label="Payment Method" className="space-y-6">
          {deliveryList.map((delivery) => (
            <Radio
              key={delivery.name}
              value={delivery}
              className="group relative flex cursor-pointer rounded-xl border border-gray-200"
            >
              <div className="flex w-full items-center justify-between sm:space-x-4 md:space-x-10 px-6 py-4 rounded-xl hover:bg-gray-100 group-data-[checked]:bg-gray-100">
                <div className="flex flex-col justify-between items-start space-y-2">
                  <h4 className="font-semibold sm:text-base md:text-xl">{delivery.name}</h4>
                  <h4 className='sm:text-base md:text-xl'>{delivery.description}</h4>
                </div>
                <span role="radio" aria-checked className="sm:size-3 md:size-5 rounded-full flex justify-center items-center border border-gray-700 bg-white">
                  <div className="invisible bg-gray-700 sm:size-1 md:size-2 rounded-full group-data-[checked]:visible" />
                </span>
              </div>
            </Radio>
          ))}
        </RadioGroup>
      )}
    </div>
  )
}

export default DeliveryList;