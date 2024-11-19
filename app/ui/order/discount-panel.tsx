import { Disclosure, DisclosureButton, DisclosurePanel, Radio, RadioGroup } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { AnimatePresence, easeOut, motion } from 'framer-motion';
import { Fragment, useEffect, useState } from 'react';
import data from "@/data/data.json";
import { useOrder } from '@/app/context/order-context';
import { Discount } from '@/data/interface';
import { calculateDiscount } from '@/utils/Transaction';

export default function DiscountPanel() {
  const discounts = data.discounts;

  const [available, setAvailable] = useState<Array<boolean>>(new Array(discounts.length).fill(false));
  const [selected, setSelected] = useState<Discount | null>(null);
  const { order, setOrder } = useOrder();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [prevTotalPrice, setPrevTotalPrice] = useState(order.productPrice);

  useEffect(() => {
    const now = new Date();
    const updatedAvailable = discounts.map(discount => {
      const startDate = new Date(discount.startDate);
      const endDate = new Date(discount.endDate);
      return now >= startDate && now <= endDate;
    });
    setAvailable(updatedAvailable);
  }, [discounts]);

  useEffect(() => {
    setOrder((prevOrder) => {
      const selectedDiscount = selected ? discounts.find(item => item.id === selected.id) : null;

      const discountPrice = selectedDiscount ? calculateDiscount(prevTotalPrice.toString(), selectedDiscount.value) : 0;
      const newTotalPrice = selectedDiscount ? (prevTotalPrice - discountPrice) : prevTotalPrice;

      return {
        ...prevOrder,
        discount: discountPrice,
        totalPrice: newTotalPrice,
      };
    });
  }, [selected, discounts, prevTotalPrice, setOrder]);

  return (
    <Disclosure as="div" defaultOpen={false}>
      {({ open }) => (
        <>
          <DisclosureButton className='flex group justify-between items-center w-full text-md underline bg-gray-100 px-4 py-1 rounded-lg hover:bg-gray-200'>
            <span>Apply a Voucher</span>
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
                    <button
                      onClick={() => { setSelected(null) }}
                      className='bg-gray-100 px-4 py-2'>
                      Unapply
                    </button>

                    <RadioGroup value={selected} onChange={setSelected} aria-label="Discount Panel">
                      {discounts.map((discount, index) => (
                        <Radio
                          key={discount.id}
                          value={discount}
                          className={`group flex items-center cursor-pointer space-x-6 space-y-4 ${available[index] ? '' : 'opacity-60 pointer-events-none'}`}
                          disabled={!available[index]}
                        >
                          <span role="radio" aria-checked className="size-4 rounded-full flex justify-center items-center border border-gray-700 bg-white">
                            <div className="invisible bg-gray-700 size-2 rounded-full group-data-[checked]:visible" />
                          </span>

                          <div className={`flex justify-between items-center w-full rounded-xl border border-gray-400 bg-gradient-to-r from-[#ff7e5f] to-[#feb47b] px-4 py-2 ${available[index] ? '' : 'opacity-60'}`}>
                            <div className='flex flex-col justify-between space-y-4 w-full'>
                              <h6 className='text-sm font-mono text-white'>{discount.name}</h6>
                              <h6 className='text-sm font-mono text-gray-500'>{discount.endDate}</h6>
                            </div>
                            <h6 className='text-3xl text-white'>{discount.value}</h6>
                          </div>
                        </Radio>
                      ))}
                    </RadioGroup>
                  </motion.div>
                </DisclosurePanel>
              )}
            </AnimatePresence>
          </div>
        </>
      )}
    </Disclosure>
  );
}