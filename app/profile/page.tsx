'use client'

import { OrderResponse } from "@/interface/order";
import { useEffect, useState } from "react";
import { getAllOrder } from "../api/order";
import { formatPrice } from "@/utils/helpers";
import Link from "next/link";
import { EyeIcon } from "@heroicons/react/24/outline";
import BackButton from "../ui/back-button";

export default function Page() {
  const [orderData, setOrderData] = useState<OrderResponse>();

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") || "" : "";
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") || "" : "";

  useEffect(() => {
    const fetchOrder = async () => {
      if (userId !== "" && accessToken !== "") {
        const response = await getAllOrder(userId, accessToken);
        setOrderData(response);
      }
    }

    fetchOrder();
  }, [accessToken, userId])

  return (
    <div className='sm:px-6 md:px-12 lg:px-24 py-10'>
      <div className='flex items-center space-x-24'>
        <BackButton previousPathname="/" />

        <ul className="flex space-x-1 text-xl">
          <li>
            <Link href="/" className='text-gray-400 hover:text-gray-900'>Home / </Link>
          </li>
          <li>Profile</li>
        </ul>
      </div>

      <div className="container mx-auto p-5">
        <h1 className="text-2xl font-semibold mb-4">Orders</h1>

        {orderData && orderData.orders.length > 0 ? (
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
            <thead>
              <tr className="border">
                <th className="px-2 py-2 text-center">ID</th>
                <th className="px-2 py-2 text-left">Full Name</th>
                <th className="px-2 py-2 text-left">Phone</th>
                <th className="px-2 py-2 text-left">Payment Method</th>
                <th className="px-2 py-2 text-left">Delivery Method</th>
                <th className="px-2 py-2 text-left">Total Price</th>
                <th className="px-2 py-2 text-left">Status</th>
                <th className="px-2 py-2 text-left">View</th>
              </tr>
            </thead>
            <tbody>
              {orderData.orders.map((order, index) => (
                <tr key={index} className={`${index % 2 == 0 ? 'bg-gray-100': ''}`}>
                  <td className="px-2 py-8 text-center">{index + 1}</td>
                  <td className="px-2 py-8 text-left">{order.shippingAddress.fullname}</td>
                  <td className="px-2 py-8 text-left">{order.shippingAddress.phone}</td>
                  <td className="px-2 py-8 text-left">
                    {order.paymentMethod === "VN_PAY" ? (
                      <span className="text-green-600 font-semibold">VNPay</span>
                    ) : (
                      <span className="text-blue-600 font-semibold">COD</span>
                    )}
                  </td>
                  <td className="px-2 py-8 text-left">{order.deliveryMethod.name}</td>
                  <td className="px-2 py-8 text-left">{formatPrice(order.totalPrice)}</td>
                  <td className="px-2 py-8 text-left">
                    {order.status === "AWAITING_PAYMENT" && (
                      <div className="bg-yellow-300 text-gray-800 text-lg font-semibold px-4 py-1 rounded-full w-fit">
                        Awaiting Payment
                      </div>
                    )}
                    {order.status === "PENDING" && (
                      <div className="bg-orange-200 text-gray-800 text-lg font-semibold px-4 py-1 rounded-full w-fit">
                        Pending
                      </div>
                    )}
                    {order.status === "PROCESSING" && (
                      <div className="bg-blue-200 text-gray-800 text-lg font-semibold px-4 py-1 rounded-full w-fit">
                        Processing
                      </div>
                    )}
                    {order.status === "AWAITING_SHIPMENT" && (
                      <div className="bg-teal-200 text-gray-800 text-lg font-semibold px-4 py-1 rounded-full w-fit">
                        Awaiting Shipment
                      </div>
                    )}
                    {order.status === "SHIPPED" && (
                      <div className="bg-green-200 text-gray-800 text-lg font-semibold px-4 py-1 rounded-full w-fit">
                        Shipped
                      </div>
                    )}
                    {order.status === "DELIVERED" && (
                      <div className="bg-gray-200 text-gray-800 text-lg font-semibold px-4 py-1 rounded-full w-fit">
                        Delivered
                      </div>
                    )}
                    {order.status === "CANCELED" && (
                      <div className="bg-red-200 text-gray-800 text-lg font-semibold px-4 py-1 rounded-full w-fit">
                        Canceled
                      </div>
                    )}
                    {order.status === "PAID" && (
                      <div className="bg-gray-300 text-gray-800 text-lg font-semibold px-4 py-1 rounded-full w-fit">
                        Paid
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-8 text-center">
                    <Link
                      href={`/order/${order.id}`}
                      className="flex justify-center text-md py-1 rounded-lg transition duration-200"
                    >
                      <EyeIcon className="size-6 transition duration-200 transform hover:scale-125" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-left text-gray-600">
            {orderData ? (
              <p>No orders available.</p>
            ) : (
              <p>Loading orders...</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
