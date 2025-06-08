'use client'

import { useOrder } from "@/app/context/AppContext";
import { CreateOrder } from "@/interface/order";
import { Radio, RadioGroup } from "@headlessui/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { BanknotesIcon } from "@heroicons/react/24/outline";

const methods = [
  { name: 'COD', value: 'COD', image: '/assets/cash-payment.png', alt: 'Cash Payment Img' },
  { name: 'VNPAY', value: 'VNPAY', image: '/assets/vnpay.png', alt: 'VNPAY Img' },
  { name: 'Momo', value: 'MOMO', image: '/assets/momo.png', alt: 'Momo Img' },
]

export default function PaymentMethod() {
  const [selected, setSelected] = useState(methods[0]);
  const { setOrder } = useOrder();

  useEffect(() => {
    setOrder(prevOrder => ({
      ...prevOrder,
      paymentMethod: selected.value,
    }) as CreateOrder);
  }, [selected, setOrder]);

  return (
    <div className="flex flex-col w-full space-y-6 mx-auto sm:p-4 md:p-10 md:rounded-xl md:shadow-lg">
      <h1 className="flex items-center gap-2 text-2xl font-bold mb-4 text-gray-800">
        <BanknotesIcon className="w-7 h-7" />
        Payment Method
      </h1>

      <RadioGroup value={selected} onChange={setSelected} aria-label="Payment Method" className="space-y-4">
        {methods.map((method) => (
          <Radio
            key={method.name}
            value={method}
            className="group relative flex cursor-pointer rounded-xl border border-gray-200 transition-colors duration-200 ease-in-out 
                      hover:border-gray-300 group-data-[checked]:border-gray-700 group-data-[checked]:bg-gray-100"
          >
            <div className="flex w-full items-center justify-between sm:space-x-4 md:space-x-10 px-4 py-2 text-gray-800 rounded-xl hover:bg-gray-100 group-data-[checked]:bg-gray-100 group-data-[checked]:outline group-data-[checked]:outline-2 group-data-[checked]:outline-gray-700">
              <div className="flex items-center space-x-4">
                <Image
                  alt={method.alt}
                  src={method.image}
                  width={40}
                  height={40}
                  className="object-contain"
                />
                <h6 className="text-base md:text-lg font-medium text-gray-800">{method.name}</h6>
              </div>
              <span role="radio" aria-checked className="w-5 h-5 rounded-full flex justify-center items-center border border-gray-700 bg-white">
                <div className="invisible w-2 h-2 rounded-full bg-gray-700 group-data-[checked]:visible" />
              </span>
            </div>
          </Radio>
        ))}
      </RadioGroup>
    </div>
  );
}
