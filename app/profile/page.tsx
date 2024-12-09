'use client'

import { OrderResponse } from "@/interface/order";
import { useEffect, useState } from "react";
import { getAllOrder } from "../api/order";
import { formatPrice } from "@/utils/helpers";

export default function Page() {
  const [orderData, setOrderData] = useState<OrderResponse>();

  const userId = localStorage.getItem('userId');
  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    const fetchOrder = async () => {
      if (userId !== null && accessToken !== null) {
        const response = await getAllOrder(userId, accessToken);
        setOrderData(response);
      }
    }

    fetchOrder();
  }, [accessToken, userId])

  return (
    <div className="container mx-auto p-5">
      <h1 className="text-2xl font-bold mb-4">Orders</h1>

      {orderData && orderData.orders.length > 0 ? (
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="border px-4 py-2 text-left">Order ID</th>
              <th className="border px-4 py-2 text-left">Full Name</th>
              <th className="border px-4 py-2 text-left">Phone</th>
              <th className="border px-4 py-2 text-left">Payment Method</th>
              <th className="border px-4 py-2 text-left">Delivery Method</th>
              <th className="border px-4 py-2 text-left">Total Price</th>
              <th className="border px-4 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {orderData.orders.map(order => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{order.id}</td>
                <td className="border px-4 py-2">{order.shippingAddress.fullname}</td>
                <td className="border px-4 py-2">{order.shippingAddress.phone}</td>
                <td className="border px-4 py-2">{order.paymentMethod}</td>
                <td className="border px-4 py-2">{order.deliveryMethod.name}</td>
                <td className="border px-4 py-2">{formatPrice(order.totalPrice)}</td>
                <td className="border px-4 py-2">{order.status}</td>
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
  );
}
