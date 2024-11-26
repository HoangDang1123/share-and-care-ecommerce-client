import React, { useEffect } from 'react';
import data from "@/data/data.json";
import { Checkbox } from '@headlessui/react';
import { CheckIcon, TrashIcon } from '@heroicons/react/20/solid';
import Image from 'next/image';
import { formatPrice } from '@/utils/helpers';

interface ItemTableProps {
  selectedAll: boolean,
  selectedItem: Array<boolean>,
  setSelectedItem: (selectedItem: Array<boolean>) => void,
}

const ItemTable: React.FC<ItemTableProps> = ({ selectedAll, selectedItem, setSelectedItem }) => {
  const cart = data.carts;

  useEffect(() => {
    if (selectedAll) {
      setSelectedItem(new Array(cart.length).fill(true));
    } else {
      setSelectedItem(new Array(cart.length).fill(false));
    }
  }, [cart, selectedAll, setSelectedItem]);

  const handleSetSelectedItem = (index: number) => {
    const newItems = [...selectedItem];
    newItems[index] = !selectedItem[index];
    setSelectedItem(newItems);
  };

  return (
    <table className='w-full'>
      <thead className='w-full'>
        <tr>
          <th />
          <th>Product</th>
          <th>Quantity</th>
          <th>Total Price</th>
          <th />
        </tr>
      </thead>

      <tbody>
        {cart.map((item, index) => (
          <tr
            key={index}
          >
            <td>
              <Checkbox
                checked={selectedItem[index]}
                onChange={() => handleSetSelectedItem(index)}
                className="group block size-5 rounded border border-gray-700 bg-white data-[checked]:bg-gray-200 hover:cursor-pointer"
              >
                <CheckIcon className='opacity-0 group-data-[checked]:opacity-100' />
              </Checkbox>
            </td>

            <td className='flex space-x-4'>
              <Image
                src={item.item.image[0]}
                alt={item.item.name}
                width={120}
                height={40}
              />
              <div className='flex flex-col justify-between w-[320px]'>
                <h6 className='font-bold'>{item.item.name}</h6>
                <div className='flex flex-col'>
                  <h6>Color: {item.item.color.name}</h6>
                  <h6>Size: {item.item.size}</h6>
                </div>
              </div>
            </td>
            <td>{item.item.quantity}</td>
            <td>
              <div className='w-[150px]'>
                {formatPrice(item.item.price)}
              </div>
            </td>
            <td>
              <button className='mt-1'>
                <TrashIcon className='size-8 text-red-500' />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default ItemTable;