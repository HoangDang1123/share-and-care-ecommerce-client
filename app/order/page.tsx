'use client'

import OrderSummary from "../ui/order/order-summary";
import BackButton from "../ui/back-button";
import AddressForm from "../ui/order/address-form";
import Link from "next/link";
import PaymentMethod from "../ui/order/payment-method";
import AddressList from "../ui/order/address-list";
import { useEffect, useState } from "react";
import { AddressDataResponse } from "@/interface/address";
import { getDefaultAddress } from "../api/address";
import DeliveryList from "../ui/order/delivery-list";
import { useOrder } from "../context/AppContext";
import { OrderData, ShippingAddressData } from "@/interface/order";

export default function Page() {
  const [isRefresh, setIsRefresh] = useState<boolean>(false);
  const [defaultAddress, setDefaultAddress] = useState<AddressDataResponse>();
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

  return (
    <div className='sm:px-6 md:px-12 lg:px-24 my-10'>
      <div className='flex items-center space-x-24'>
        <BackButton previousPathname="/cart" />

        <ul className="flex space-x-1 text-xl">
          <li>
            <Link href="/" className='text-gray-400 hover:text-gray-900'>Home / </Link>
          </li>
          <li>
            Order
          </li>
        </ul>
      </div>

      <div className='flex px-20 space-x-20 mt-10'>
        <div className="flex flex-col space-y-10">
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
