import OrderSummary from "../ui/order/order-summary";
import BackButton from "../ui/back-button";
import DeliveryForm from "../ui/order/delivery-form";
import Link from "next/link";
import PaymentMethod from "../ui/order/payment-method";

export default function Page() {
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

      <div className='flex px-24 space-x-20 mt-10'>
        <div className="flex flex-col space-y-10">
          <DeliveryForm />
          <PaymentMethod />
        </div>
        <OrderSummary />
      </div>
    </div>
  );
}
