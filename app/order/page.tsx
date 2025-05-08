'use client'

import OrderSummary from "../ui/order/order-summary";
import BackButton from "../ui/back-button";
import AddressForm from "../ui/order/address-form";
import Link from "next/link";
import PaymentMethod from "../ui/order/payment-method";
import AddressList from "../ui/order/address-list";
import { useEffect, useState } from "react";
import { AddressResponse } from "@/interface/address";
import { getDefaultAddress } from "../api/address";
import DeliveryList from "../ui/order/delivery-list";
import { useOrder } from "../context/AppContext";
import { OrderData, ShippingAddressData } from "@/interface/order";

export default function Page() {
  const [isRefresh, setIsRefresh] = useState<boolean>(false);
  const [defaultAddress, setDefaultAddress] = useState<AddressResponse>();
  const [existAddress, setExistAddress] = useState(false);
  const { setOrder } = useOrder();

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";

  useEffect(() => {
    const fetchAddress = async () => {
      if (userId !== "" && accessToken !== "") {
        try {
          const response = await getDefaultAddress(userId, accessToken);
          setDefaultAddress(response);
          setOrder(prevOrder => {
            const newShippingAddress: ShippingAddressData = {
              fullname: response.name,
              phone: response.phone,
              street: response.street,
              ward: response.ward,
              district: response.district,
              city: response.city,
            };

            return {
              ...prevOrder,
              shippingAddress: newShippingAddress,
            } as OrderData;
          });
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) { }
      }
    }

    fetchAddress();
  }, [userId, accessToken, isRefresh, setOrder]);

  if (userId === "" || accessToken === "") {
    return (
      <div className="flex justify-center items-center h-[735px] bg-black gap-x-4">
        <h6 className="text-white">Please log in to continue</h6>
        <Link
          href="/auth/login"
          className="flex-none rounded-full bg-white px-3 py-1 sm:text-xs md:text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
        >
          Go to Login <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
    )
  }

  return (
    <div className='md:px-12 lg:px-24 sm:my-5 md:my-20'>
      <div className='flex items-center sm:px-6 md:px-0 sm:space-x-8 md:space-x-24'>
        <BackButton />

        <ul className="flex space-x-1 sm:text-md md:text-xl">
          <li>
            <Link href="/" className='text-gray-400 hover:text-gray-900'>Home / </Link>
          </li>
          <li>
            Order
          </li>
        </ul>
      </div>

      <div className='grid sm:grid-cols-1 md:grid-cols-3 w-full md:px-20 sm:gap-y-10 md:gap-x-20 sm:mt-4 md:mt-10'>
        <div className="flex flex-col md:col-span-2 w-full sm:space-y-4 md:space-y-10">
          <AddressList isRefresh={isRefresh} setIsRefresh={setIsRefresh} defaultAddress={defaultAddress} setExistAddress={setExistAddress} />
          <AddressForm setIsRefresh={setIsRefresh} existAddress={existAddress} />
          <DeliveryList defaultAddress={defaultAddress} />
          <PaymentMethod />
        </div>

        <OrderSummary />
      </div>
    </div>
  );
}
