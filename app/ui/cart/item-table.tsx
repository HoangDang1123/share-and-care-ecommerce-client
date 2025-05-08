import React, { useEffect, useState } from 'react';
import { Checkbox } from '@headlessui/react';
import { CheckIcon, TrashIcon } from '@heroicons/react/20/solid';
import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { formatPrice, splitVariantSlug } from '@/utils/helpers';
import { deleteCartItem, getCart, updateCartItem } from '@/app/api/cart';
import { toast } from 'react-toastify';
import ClipLoader from 'react-spinners/ClipLoader';
import { useRouter } from 'next/navigation';
import { useCart } from '@/app/context/AppContext';

interface ItemTableProps {
  selectedAll: boolean,
  selectedItem: Array<boolean>,
  setSelectedItem: (selectedItem: Array<boolean>) => void,
}

const ItemTable: React.FC<ItemTableProps> = ({ selectedAll, selectedItem, setSelectedItem }) => {
  const [loadingItems, setLoadingItems] = useState<boolean[]>([]);
  const [quantities, setQuantities] = useState<number[]>([]);
  const router = useRouter();
  const { cart, setCart } = useCart();

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";

  useEffect(() => {
    if (cart) {
      if (selectedAll) {
        setSelectedItem(new Array(cart.items.length).fill(true));
      } else {
        setSelectedItem(new Array(cart.items.length).fill(false));
      }
      setLoadingItems(new Array(cart.items.length).fill(false));
    }
  }, [cart, selectedAll, setSelectedItem]);

  useEffect(() => {
    if (cart) {
      const quantitiesArray = cart.items.map(item => item.quantity);
      setQuantities(quantitiesArray);
    }
  }, [cart]);

  const handleSetSelectedItem = (index: number) => {
    const newItems = [...selectedItem];
    newItems[index] = !selectedItem[index];
    setSelectedItem(newItems);
  };

  const handleDeleteItem = (productId: string, variantId: string, index: number) => {
    const cartItem = {
      productId: productId,
      variantId: variantId
    };

    const fetchDeleteCartItem = async () => {
      const newLoadingItems = [...loadingItems];
      newLoadingItems[index] = true;
      setLoadingItems(newLoadingItems);

      if (userId !== "" && accessToken !== "") {
        try {
          await deleteCartItem(cartItem, userId, accessToken);
          try {
            const response = await getCart(userId, accessToken);
            setCart(response);
            setSelectedItem(new Array(response.items.length).fill(false));
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
          } catch (error) { }

          toast.success("Delete item successful.");
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          toast.error("Failed to delete item.");
        } finally {
          newLoadingItems[index] = false;
          setLoadingItems(newLoadingItems);
        }
      }
    };

    fetchDeleteCartItem();
  };

  const updateQuantity = async (productId: string, variantId: string, quantity: number, index: number) => {
    if (userId && accessToken) {
      try {
        const newQuantity = Math.max(1, Math.min(quantity, 10000));
        setQuantities(prevQuantities => {
          const newQuantities = [...prevQuantities];
          newQuantities[index] = newQuantity;
          return newQuantities;
        });

        const itemData = {
          productId: productId,
          variantId: variantId,
          quantity: newQuantity,
        };

        await updateCartItem(itemData, userId, accessToken);
        try {
          const response = await getCart(userId, accessToken);
          setCart(response);
          setSelectedItem(new Array(response.items.length).fill(false));

          console.log('productId:', productId)
          console.log('quantity:', quantity)
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) { }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) { }
    }
  };

  const handleInputQuantity = (newQuantity: number, productId: string, variantId: string, index: number) => {
    const validQuantity = Math.max(newQuantity, 1);
    setQuantities(prevQuantities => {
      const newQuantities = [...prevQuantities];
      newQuantities[index] = validQuantity;
      return newQuantities;
    });
    updateQuantity(productId, variantId, validQuantity, index);
  };

  const handleClickItem = (id: string) => {
    router.push(`/product/${id}`);
  }

  return (
    <div>
      <table className='sm:hidden md:block w-full'>
        <thead className='w-full'>
          <tr>
            <th />
            <th>Product</th>
            <th>Quantity</th>
            <th>Product Price</th>
            <th>Total Price</th>
            <th />
          </tr>
        </thead>

        <tbody>
          {cart && cart.items.map((item, index) => (
            <tr key={index}>
              <td>
                <Checkbox
                  checked={selectedItem[index] !== undefined ? selectedItem[index] : false}
                  onChange={() => handleSetSelectedItem(index)}
                  className="group block sm:size-4 md:size-5 rounded border border-gray-700 bg-white data-[checked]:bg-gray-200 hover:cursor-pointer"
                >
                  <CheckIcon className='opacity-0 group-data-[checked]:opacity-100' />
                </Checkbox>
              </td>

              <td
                className='flex space-x-4 hover:cursor-pointer'
                onClick={() => handleClickItem(item.productId)}
              >
                <Image
                  src={item.productImage}
                  alt={item.productName}
                  width={120}
                  height={40}
                  className='w-auto h-auto'
                />
                <div className='flex flex-col justify-between w-[200px]'>
                  <h6 className='font-bold text-left'>{item.productName}</h6>
                  <div className='flex flex-col text-left'>
                    <h6>Color: {item.variantSlug && splitVariantSlug(item.variantSlug)[0]}</h6>
                    <h6>Size: {item.variantSlug && splitVariantSlug(item.variantSlug)[1]}</h6>
                  </div>
                </div>
              </td>
              <td>
                <div className='flex items-center justify-between space-x-2 rounded-md'>
                  <button
                    onClick={() => updateQuantity(item.productId, item.variantId, quantities[index] - 1, index)}
                    className='flex justify-center items-center px-1 py-1 h-full rounded-md border-solid border border-gray-900'
                  >
                    <MinusIcon className='size-5' />
                  </button>

                  <input
                    type="number"
                    className="w-20 text-center border-solid border border-gray-900 rounded-md text-xl"
                    value={quantities[index] || item.quantity}
                    onChange={(e) => handleInputQuantity(Number(e.target.value), item.productId, item.variantId, index)}
                    min="1"
                  />

                  <button
                    onClick={() => updateQuantity(item.productId, item.variantId, quantities[index] + 1, index)}
                    className='flex justify-center items-center px-1 py-1 h-full rounded-md border-solid border border-gray-900'
                  >
                    <PlusIcon className='size-5' />
                  </button>
                </div>
              </td>
              <td>
                <div className='w-[150px]'>
                  {formatPrice(item.price)}
                </div>
              </td>
              <td>
                <div className='w-[150px]'>
                  {formatPrice(item.itemTotalPrice)}
                </div>
              </td>
              <td>
                <button
                  onClick={() => handleDeleteItem(item.productId, item.variantId, index)}
                  className='mb-2'
                >
                  {loadingItems[index] ? (
                    <ClipLoader
                      size={20}
                      color='#000000'
                      aria-label="Loading Spinner"
                    />
                  ) : (
                    <TrashIcon className='size-8 text-red-500' />
                  )}
                </button>
              </td>
            </tr>
          ))
          }
        </tbody>
      </table>

      <div>
        {cart && cart.items.map((item, index) => (
          <div 
            key={index} 
            className='sm:grid md:hidden grid-cols-[1fr_8fr_1fr] w-full px-4 py-2 justify-center items-center border-t-4 border-b-4 border-gray-100'
          >
            <Checkbox
              checked={selectedItem[index] !== undefined ? selectedItem[index] : false}
              onChange={() => handleSetSelectedItem(index)}
              className="group block sm:size-4 md:size-5 rounded border border-gray-700 bg-white data-[checked]:bg-gray-200 hover:cursor-pointer"
            >
              <CheckIcon className='opacity-0 group-data-[checked]:opacity-100' />
            </Checkbox>

            <div
              className='grid grid-cols-[1fr_3fr] justify-center items-center'
              onClick={() => handleClickItem(item.productId)}
            >
              <Image
                src={item.productImage}
                alt={item.productName}
                width={120}
                height={40}
                className='w-auto h-auto row-span-3'
              />

              <div className='ml-4 space-y-4'>
                <div className='flex flex-col justify-between w-full'>
                  <h6 className='font-bold text-left'>{item.productName}</h6>
                  <div className='flex flex-col text-left'>
                    <h6>Color: {item.variantSlug && splitVariantSlug(item.variantSlug)[0]}</h6>
                    <h6>Size: {item.variantSlug && splitVariantSlug(item.variantSlug)[1]}</h6>
                  </div>
                </div>

                <div className='flex items-center space-x-2 rounded-md'>
                  <button
                    onClick={() => updateQuantity(item.productId, item.variantId, quantities[index] - 1, index)}
                    className='flex justify-center items-center px-1 py-1 h-full rounded-md border-solid border border-gray-900'
                  >
                    <MinusIcon className='size-3' />
                  </button>

                  <input
                    type="number"
                    className="w-16 text-center border-solid border border-gray-900 rounded-md text-sm"
                    value={quantities[index] || item.quantity}
                    onChange={(e) => handleInputQuantity(Number(e.target.value), item.productId, item.variantId, index)}
                    min="1"
                  />

                  <button
                    onClick={() => updateQuantity(item.productId, item.variantId, quantities[index] + 1, index)}
                    className='flex justify-center items-center px-1 py-1 h-full rounded-md border-solid border border-gray-900'
                  >
                    <PlusIcon className='size-3' />
                  </button>
                </div>

                <div className='w-fit'>
                  {formatPrice(item.itemTotalPrice)}
                </div>
              </div>
            </div>

            <button
              onClick={() => handleDeleteItem(item.productId, item.variantId, index)}
              className='mb-2'
            >
              {loadingItems[index] ? (
                <ClipLoader
                  size={20}
                  color='#000000'
                  aria-label="Loading Spinner"
                />
              ) : (
                <TrashIcon className='size-5 text-red-500' />
              )}
            </button>
          </div>
        ))
        }
      </div>
    </div>
  );
};

export default ItemTable;