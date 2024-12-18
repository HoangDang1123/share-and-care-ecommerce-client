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
              <tr className="bg-gray-200 text-gray-700">
                <th className="border px-4 py-2 text-center">ID</th>
                <th className="border px-4 py-2 text-center">Full Name</th>
                <th className="border px-4 py-2 text-center">Phone</th>
                <th className="border px-4 py-2 text-center">Payment Method</th>
                <th className="border px-4 py-2 text-center">Delivery Method</th>
                <th className="border px-4 py-2 text-center">Total Price</th>
                <th className="border px-4 py-2 text-center">Status</th>
                <th className="border px-4 py-2 text-center">View</th>
              </tr>
            </thead>
            <tbody>
              {orderData.orders.map((order, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2 text-center">{index + 1}</td>
                  <td className="border px-4 py-2">{order.shippingAddress.fullname}</td>
                  <td className="border px-4 py-2">{order.shippingAddress.phone}</td>
                  <td className="border px-4 py-2 text-center">
                    {order.paymentMethod === "VN_PAY" ? (
                      <span className="text-green-600 font-semibold">VNPay</span>
                    ) : (
                      <span className="text-blue-600 font-semibold">COD</span>
                    )}
                  </td>
                  <td className="border px-4 py-2 text-center">{order.deliveryMethod.name}</td>
                  <td className="border px-4 py-2 text-center">{formatPrice(order.totalPrice)}</td>
                  <td className="border px-4 py-2 text-center">
                    {order.status === "AWAITING_PAYMENT" && (
                      <div className="bg-yellow-600 text-white text-lg font-semibold py-1 rounded-full">
                        Awaiting Payment
                      </div>
                    )}
                    {order.status === "PENDING" && (
                      <div className="bg-orange-600 text-white text-lg font-semibold py-1 rounded-full">
                        Pending
                      </div>
                    )}
                    {order.status === "PROCESSING" && (
                      <div className="bg-blue-600 text-white text-lg font-semibold py-1 rounded-full">
                        Processing
                      </div>
                    )}
                    {order.status === "AWAITING_SHIPMENT" && (
                      <div className="bg-orange-600 text-white text-lg font-semibold py-1 rounded-full">
                        Awaiting Shipment
                      </div>
                    )}
                    {order.status === "SHIPPED" && (
                      <div className="bg-green-600 text-white text-lg font-semibold py-1 rounded-full">
                        Shipped
                      </div>
                    )}
                    {order.status === "DELIVERED" && (
                      <div className="bg-gray-600 text-white text-lg font-semibold py-1 rounded-full">
                        Delivered
                      </div>
                    )}
                  </td>
                  <td className="border px-4 py-2 text-center">
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
          <div className="text-center text-gray-600">
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
