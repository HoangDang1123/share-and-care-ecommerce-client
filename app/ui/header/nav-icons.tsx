import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from "react";
import Search from './icons/search';
import User from './icons/user';
import Cart from './icons/cart';

export default function NavIcons() {
    const searchParams = useSearchParams();
    const [isLogin, setIsLogin] = useState(false);

    useEffect(() => {
        const refreshToken = searchParams.get('refreshToken');

        const refreshTokenString = Array.isArray(refreshToken) ? refreshToken[0] : refreshToken || '';

        if (refreshToken) {
            localStorage.setItem('refreshToken', refreshTokenString);

            setIsLogin(true);
        }
    }, [searchParams]);

    return (
        <div className="flex space-x-6">
            <Search />
            <User isLogin={isLogin} />
            <Cart isLogin={isLogin} />
        </div>
    )
}
