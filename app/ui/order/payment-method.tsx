'use client'

import { useOrder } from "@/app/context/AppContext";
import { OrderData } from "@/interface/order";
import { Radio, RadioGroup } from "@headlessui/react";
import Image from "next/image";
import { useEffect, useState } from "react";

const methods = [
  { name: 'COD', value: 'COD', image: '/assets/cash-payment.png', alt: 'Cash Payment Img' },
  { name: 'VNPAY', value: 'VN_PAY', image: '/assets/vnpay.png', alt: 'VNPAY Img' },
]

export default function PaymentMethod() {
  const [selected, setSelected] = useState(methods[0]);
  const { setOrder } = useOrder();

  useEffect(() => {
    setOrder(prevOrder => {
      return {
        ...prevOrder,
        paymentMethod: selected.value,
      } as OrderData;
    });
  }, [selected, setOrder]);

  return (
    <div className="flex flex-col w-[1082px] space-y-4 mx-auto p-10 rounded-xl shadow-lg">
      <h1 className="mb-6">Payment Method</h1>
      <RadioGroup value={selected} onChange={setSelected} aria-label="Payment Method" className="space-y-6">
        {methods.map((method) => (
          <Radio
            key={method.name}
            value={method}
            className="h-16 group relative flex cursor-pointer rounded-xl border border-gray-200"
          >
            <div className="flex w-full items-center justify-between px-4 py-2 rounded-xl hover:bg-gray-100 group-data-[checked]:bg-gray-100 group-data-[checked]:border-gray-100">
              <div className="flex justify-between items-center space-x-4">
                <Image
                  alt="Cash Payment img"
                  src={method.image}
                  width={40}
                  height={40}
                />
                <h6 className="text-xl font-semibold">{method.name}</h6>
              </div>
              <span role="radio" aria-checked className=" size-5 rounded-full flex justify-center items-center border border-gray-700 bg-white">
                <div className="invisible bg-gray-700 size-2 rounded-full group-data-[checked]:visible" />
              </span>
            </div>
          </Radio>
        ))}
      </RadioGroup>
    </div>
  );
}