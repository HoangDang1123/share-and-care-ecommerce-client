import Search from './icons/search';
import User from './icons/user';
import Cart from './icons/cart';
import { useAuth } from "@/app/context/AppContext";
import { Suspense } from 'react';

export default function NavIcons() {
  const { isLogin } = useAuth();

  return (
    <div className="flex items-center justify-center sm:space-x-2 md:space-x-4">
      <Suspense fallback={<div>Loading...</div>}>
        <Search />
        <User isLogin={isLogin} />
        <Cart isLogin={isLogin} />
      </Suspense>
    </div>
  )
}
