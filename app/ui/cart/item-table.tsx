import React, { useEffect, useState } from 'react';
import { Checkbox } from '@headlessui/react';
import { CheckIcon, TrashIcon } from '@heroicons/react/20/solid';
import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { formatPrice } from '@/utils/helpers';
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

  useEffect(() => {
    console.log(quantities);
  }, [quantities])

  const handleSetSelectedItem = (index: number) => {
    const newItems = [...selectedItem];
    newItems[index] = !selectedItem[index];
    setSelectedItem(newItems);
  };

  const handleDeleteItem = (productId: string, index: number, variantId?: string) => {
    const cartItem: {
      productId: string;
      variantId?: string;
    } = {
      productId
    };

    if (variantId) {
      cartItem.variantId = variantId;
    }

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

  const updateQuantity = async (productId: string, quantity: number, index: number, variantId?: string) => {
    if (userId && accessToken) {
      try {
        const newQuantity = Math.max(1, Math.min(quantity, 10000));
        setQuantities(prevQuantities => {
          const newQuantities = [...prevQuantities];
          newQuantities[index] = newQuantity;
          return newQuantities;
        });

        const itemData: {
          productId: string;
          quantity: number;
          variantId?: string;
        } = {
          productId,
          quantity: newQuantity,
        };

        if (variantId) {
          itemData.variantId = variantId;
        }

        await updateCartItem(itemData, userId, accessToken);
        try {
          const response = await getCart(userId, accessToken);
          setCart(response);
          setSelectedItem(new Array(response.items.length).fill(false));

          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) { }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) { }
    }
  };

  const handleInputQuantity = (newQuantity: number, productId: string, index: number, variantId?: string) => {
    const validQuantity = Math.max(newQuantity, 1);
    setQuantities(prevQuantities => {
      const newQuantities = [...prevQuantities];
      newQuantities[index] = validQuantity;
      return newQuantities;
    });
    updateQuantity(productId, validQuantity, index, variantId);
  };

  const handleClickItem = (id: string) => {
    router.push(`/product/${id}`);
  }

  const renderVariantDetails = (
    variants: { name: string; options: string[] }[],
    variantSlug?: string,
  ) => {
    if (!variantSlug || variants.length === 0) return null;

    const values = variantSlug.split('/');

    const details = variants.map((variant, index) => (
      <h6 key={variant.name}>
        {variant.name}: {values[index]}
      </h6>
    ));

    return <div className="flex flex-col text-left">{details}</div>;
  };

  return (
    <div className='w-full'>
      <table className='sm:hidden md:block w-full'>
        <thead>
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
                  <h6 className='font-semibold text-left'>{item.productName}</h6>
                  {renderVariantDetails(item.variants, item.variantSlug)}
                </div>
              </td>
              <td>
                <div className='flex items-center justify-between space-x-2 rounded-md'>
                  <button
                    onClick={() => updateQuantity(item.productId, quantities[index] - 1, index, item.variantId)}
                    className='flex justify-center items-center px-1 py-1 h-full rounded-md border-solid border border-gray-900'
                  >
                    <MinusIcon className='size-5' />
                  </button>

                  <input
                    type="number"
                    className="w-20 text-center border-solid border border-gray-900 rounded-md text-xl"
                    value={quantities[index] || item.quantity}
                    onChange={(e) => handleInputQuantity(Number(e.target.value), item.productId, index, item.variantId)}
                    min="1"
                  />

                  <button
                    onClick={() => updateQuantity(item.productId, quantities[index] + 1, index, item.variantId)}
                    className='flex justify-center items-center px-1 py-1 h-full rounded-md border-solid border border-gray-900'
                  >
                    <PlusIcon className='size-5' />
                  </button>
                </div>
              </td>
              <td>
                <div className='w-[150px]'>
                  {formatPrice(item.price ? item.price : item.originalPrice)}
                </div>
              </td>
              <td>
                <div className='w-[150px]'>
                  {formatPrice(item.price ? item.itemTotalPrice : item.itemTotalOriginalPrice)}
                </div>
              </td>
              <td>
                <button
                  onClick={() => handleDeleteItem(item.productId, index, item.variantId)}
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
    </div>
  );
};

export default ItemTable;